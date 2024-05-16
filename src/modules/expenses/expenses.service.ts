import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expence } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { Payment, Preference } from 'mercadopago';
import { User } from '../users/entities/user.entity';
import * as moment from 'moment';
import { Property } from '../properties/entities/property.entity';
import { mercadopagoConfig } from 'src/config/mercadoPago.config';
import { CreatePayDto } from './dto/create-pay.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expence)
    private readonly expenceRepository: Repository<Expence>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
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
      expenceValidated.userProperty = expenceValidated.property.user.id;
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

    if (!expences) throw new NotFoundException('No se encontro Expensas');
    const propertysExpences = [];
    console.log(expences.properties);
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
}
