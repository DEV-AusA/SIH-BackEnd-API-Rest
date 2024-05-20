import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { DataSource, Repository } from 'typeorm';
import { Payment, Preference } from 'mercadopago';
import { User } from '../users/entities/user.entity';
import * as moment from 'moment';
import { Property } from '../properties/entities/property.entity';
import { mercadopagoConfig } from 'src/config/mercadoPago.config';
import { CreatePayDto } from './dto/create-pay.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenceDto } from './dto/update-expense.dto';
import { PdfInvoiceHelper } from 'src/helpers/pdf-invoice.helper';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenceRepository: Repository<Expense>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly dataSource: DataSource,
  ) {}

  async createPay(createPayDto: CreatePayDto) {
    //Expence
    //comprobar expence
    const preference = await new Preference(mercadopagoConfig.client).create({
      body: {
        items: [
          {
            id: `${createPayDto.id}`,
            title: 'Expensa',
            quantity: 1,
            currency_id: 'ARS',
            unit_price: createPayDto.amount,
            description: '',
            category_id: 'Pago por expensa',
          },
        ],
        back_urls: {
          success: 'https://cessi.org.ar/',
          failure: 'https://cessi.org.ar/',
          pending: 'https://cessi.org.ar/',
        },
      },
    });
    return preference.init_point!;
  }

  async statu(id: string) {
    try {
      const payment = await new Payment(mercadopagoConfig.client).get({
        id: id,
      });
      const infoPayment = payment.additional_info.items[0];
      const expenceValidated = await this.expenceRepository.findOne({
        where: { id: infoPayment.id },
        relations: ['property', 'property.user'],
      });

      if (expenceValidated.state)
        throw new NotFoundException('La expensa ya esta pagada');

      if (payment.status !== 'approved')
        throw new NotFoundException('Pago de expensa rechazado');

      expenceValidated.state = true;
      // expenceValidated.userProperty = expenceValidated.property.user.id;
      expenceValidated.datePaid = new Date();
      expenceValidated.numberOperation = payment.id.toString();

      await this.expenceRepository.save(expenceValidated);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getExpenses() {
    const expences = await this.expenceRepository.find({});
    if (!expences.length) throw new NotFoundException('No hay expensas');

    return expences;
  }

  async getExpensesProperties() {
    const expencesProperties = await this.expenceRepository.find({
      relations: ['property', 'property.user'],
    });

    return expencesProperties;
  }

  async getExpensesUserId(id: string) {
    const expences = await this.userRepository.findOne({
      where: { id: id },
      relations: ['properties', 'properties.expences'],
    });

    if (!expences) throw new NotFoundException('No se encontro Usuario');
    const propertysExpences = [];
    for (const propertie of expences.properties) {
      propertysExpences.push(propertie);
    }
    if (!propertysExpences.length)
      throw new NotFoundException('No se encontro Propiedades');
    return propertysExpences;
  }

  async createAllExpenses(createExpenseDto: CreateExpenseDto) {
    const userActive = await this.userRepository.find({
      where: { state: true, validate: true },
    });
    if (!userActive.length) {
      throw new NotFoundException('No hay propietarios activos');
    }
    const fechaActual = moment();
    const anoAct = fechaActual.year();
    const mesAct = fechaActual.month() + 1;
    const lastExpense = await this.expenceRepository
      .createQueryBuilder('expense')
      .select('expense.dateGenerated')
      .orderBy('expense.dateGenerated', 'DESC')
      .getOne();
    if (!lastExpense === false) {
      const lastFtc = moment(lastExpense.dateGenerated);

      const anoLast = lastFtc.year();
      const mesLast = lastFtc.month() + 1;

      if (anoAct <= anoLast && mesAct === mesLast) {
        throw new NotFoundException('Ya hay expensas para este mes');
      }
    }
    const bandera = { state: true };
    for (const user of userActive) {
      //controla la creacion y incremento del ticket
      for (const propertie of user.properties) {
        bandera.state = false;
        const lastExpenseProperty = await this.expenceRepository.findOne({
          where: { property: propertie },
          order: { dateGenerated: 'DESC' },
        });
        const ticketInc = { num: 1 };
        if (lastExpenseProperty?.ticket) {
          const yearGenerated = moment(
            lastExpenseProperty.dateGenerated,
          ).year();
          const yearAct = moment().year();
          if (yearGenerated === yearAct) {
            ticketInc.num = Number(lastExpenseProperty.ticket) + 1;
          }
        }
        const expence = this.expenceRepository.create({
          amount: createExpenseDto.amount,
          userProperty: user.id,
          property: propertie,
          dateGenerated: new Date(),
          ticket: ticketInc.num,
          typeExpenses: 'Expensa Mensual',
          description: 'Seguridad - Limpieza - Mantenimento',
        });
        await this.expenceRepository.save(expence);
      }
    }
    if (bandera.state) {
      throw new NotFoundException(
        'No hay propiedades relacionadas con los Usuarios Activos',
      );
    }

    return {
      message: 'Expensas creadas para todos los propietarios',
    };
  }

  async createExpense(createExpenseDto: CreateExpenseDto, id: string) {
    const property = await this.propertyRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!property) throw new NotFoundException('La Propiedad no existe');

    const lastExpenseProperty = await this.expenceRepository.findOne({
      where: { property: property },
      order: { dateGenerated: 'DESC' },
    });
    const ticketInc = { num: 1 };
    if (lastExpenseProperty?.ticket) {
      const yearGenerated = moment(lastExpenseProperty.dateGenerated).year();
      const yearAct = moment().year();
      if (yearGenerated === yearAct) {
        ticketInc.num = Number(lastExpenseProperty.ticket) + 1;
      }
    }
    const expence = this.expenceRepository.create({
      amount: createExpenseDto.amount,
      property: property,
      dateGenerated: new Date(),
      userProperty: property.user.id,
      ticket: ticketInc.num,
      typeExpenses: 'Expensa Extraordinaria',
    });
    await this.expenceRepository.save(expence);
    return {
      message: 'Expensa Creada',
    };
  }

  async updateExpence(updateExpenceDto: UpdateExpenceDto, id: string) {
    const expenceValidated = await this.expenceRepository.findOne({
      where: { id: id },
    });
    if (!expenceValidated) throw new NotFoundException('La expensa no existe');

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const expenceUpdated = await queryRunner.manager.preload(Expense, {
        id: id,
        ...updateExpenceDto,
      });
      await queryRunner.manager.save(expenceUpdated);
      await queryRunner.commitTransaction();
      return {
        message: 'Expensa actualizada',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async generatePdf(id: string): Promise<Buffer> {
    const expence = await this.expenceRepository.findOne({
      where: { id: id },
      relations: ['property', 'property.user'],
    });

    if (!expence) throw new NotFoundException('La expensa no existe');

    const pdfBuffer = await new PdfInvoiceHelper().generatePdfPDFKit(expence);
    return pdfBuffer;
  }
}
