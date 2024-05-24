import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
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
    //recibe el id de la expensa y el monto,
    //comprobar expence
    const expenseValidate = await this.expenceRepository.findOne({
      where: { id: createPayDto.id },
    });
    if (!expenseValidate) throw new NotFoundException('La expensa no existe');

    const preference = await new Preference(mercadopagoConfig.client).create({
      body: {
        items: [
          {
            id: `${createPayDto.id}`,
            title: `${expenseValidate.typeExpenses}`,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: createPayDto.amount,
            description: `${expenseValidate.description}`,
            category_id: 'Pago por expensa',
          },
        ],
        back_urls: {
          success: 'https://secureingresshome.vercel.app/acciones/expensas',
          failure: 'https://secureingresshome.vercel.app/acciones/expensas',
          pending: 'https://secureingresshome.vercel.app/acciones/expensas',
        },
      },
    });
    return { urlMercadopago: preference.init_point! };
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
      return {
        message: 'La expensa ha sido pagada',
      };
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
    if (!expencesProperties.length)
      throw new NotFoundException('No hay expensas');

    return expencesProperties;
  }

  async getExpensesUserId(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['properties', 'properties.expences'],
    });

    if (!user) throw new NotFoundException('No se encontro Usuario');
    const propertysExpences = [];
    for (const propertie of user.properties) {
      propertysExpences.push(propertie);
    }
    if (!propertysExpences.length)
      throw new NotFoundException('No se encontro Propiedades');

    return propertysExpences;
  }

  async getExpensePropertyId(id: string) {
    const property = await this.propertyRepository.findOne({
      where: { id: id },
      relations: ['expences'],
    });

    if (!property) throw new NotFoundException('No se encontro Propiedades');
    return property;
  }

  async createAllExpenses(createExpenseDto: CreateExpenseDto) {
    const dayLimit = 30;
    const userActive = await this.userRepository.find({
      where: { state: true, validate: true, rol: 'owner' },
    });
    if (!userActive.length) {
      throw new NotFoundException('No hay propietarios activos');
    }

    const users = await this.userRepository.find({
      where: { state: true, rol: 'owner' },
      relations: ['properties', 'properties.expences'],
    });

    if (!users.length) throw new NotFoundException('No se encontro Usuarios');
    for (const user of users) {
      for (const propertie of user.properties) {
        const lastExpenseTicket = await this.expenceRepository
          .createQueryBuilder('expense')
          .where('expense.property = :id', { id: propertie.id })
          .orderBy('expense.dateGenerated', 'DESC')
          .addOrderBy('expense.ticket', 'DESC')
          .getOne();
        const lastExpenseLimit = await this.expenceRepository
          .createQueryBuilder('expense')
          .where('expense.property = :id', { id: propertie.id })
          .andWhere('expense.typeExpenses = :typeExpenses', {
            typeExpenses: 'Expensa Mensual',
          })
          .orderBy('expense.dateGenerated', 'DESC')
          .getOne();
        // Controla los dias del dia limitet
        const dateCurrent = moment('2024-06-01');

        const dateGeneratedTicket = moment(lastExpenseTicket?.dateGenerated);
        const dateGeneratedLimit = moment(lastExpenseLimit?.dateGenerated);
        const differenceDays = Math.abs(
          dateGeneratedLimit.diff(dateCurrent, 'days'),
        );

        if (differenceDays < (Number(lastExpenseLimit?.dayLimit) || dayLimit))
          throw new NotAcceptableException(
            `No se puede generar expensas, el limite de dias es de ${Number(lastExpenseLimit?.dayLimit) || dayLimit}, falta ${(Number(lastExpenseLimit?.dayLimit) || dayLimit) - differenceDays} dias`,
          );
        // Crear Expensa para cada propiedad
        const expence = this.expenceRepository.create({
          amount: createExpenseDto.amount,
          userProperty: user.id,
          property: propertie,
          dateGenerated: new Date('2024-06-01'),
          ticket:
            dateCurrent.year() > dateGeneratedTicket?.year()
              ? 1
              : Number(lastExpenseTicket?.ticket) + 1 || 1,
          typeExpenses: 'Expensa Mensual',
          description: createExpenseDto?.description
            ? createExpenseDto.description
            : 'Seguridad - Limpieza - Mantenimento',
          dayLimit: createExpenseDto?.dayLimit || dayLimit,
        });
        await this.expenceRepository.save(expence);
      }
    }
    return {
      message: 'Expensas creadas para todos los propietarios',
    };
  }
  async createExpense(createExpenseDto: CreateExpenseDto) {
    const property = await this.propertyRepository.findOne({
      where: { id: createExpenseDto.id },
      relations: ['user'],
    });
    if (!property) throw new NotFoundException('La Propiedad no existe');

    const lastExpenseTicket = await this.expenceRepository
      .createQueryBuilder('expense')
      .where('expense.property = :id', { id: createExpenseDto.id })
      .orderBy('expense.dateGenerated', 'DESC')
      .addOrderBy('expense.ticket', 'DESC')
      .getOne();

    const dateCurrent = moment();

    const dateGeneratedTicket = moment(lastExpenseTicket?.dateGenerated);
    // const ticketInc = { num: 1 };
    // if (lastExpenseProperty?.ticket) {
    //   const yearGenerated = moment(lastExpenseProperty.dateGenerated).year();
    //   const yearAct = moment().year();
    //   if (yearGenerated === yearAct) {
    //     ticketInc.num = Number(lastExpenseProperty.ticket) + 1;
    //   }
    // }

    const expence = this.expenceRepository.create({
      amount: createExpenseDto.amount,
      property: property,
      dateGenerated: new Date(),
      userProperty: property.user.id,
      ticket:
        dateCurrent.year() === dateGeneratedTicket?.year()
          ? Number(lastExpenseTicket?.ticket) + 1 || 1
          : 1,
      typeExpenses: 'Gastos Extraordinarios',
      description: createExpenseDto.description
        ? createExpenseDto.description
        : 'Gastos Extras',
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
