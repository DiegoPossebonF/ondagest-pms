import db from '@/lib/db'
import { hash } from 'bcryptjs'
import { addDays } from 'date-fns'

async function main() {
  // Criação de usuários
  const admin = await db.user.create({
    data: {
      name: 'Admin Master',
      email: 'admin@ondagest.com',
      password: await hash('admin123', 10),
      role: 'ADMIN',
    },
  })

  const employee = await db.user.create({
    data: {
      name: 'Funcionário 1',
      email: 'funcionario@ondagest.com',
      password: await hash('func123', 10),
      role: 'USER',
    },
  })

  // Hóspede
  const guest = await db.guest.create({
    data: {
      name: 'João Silva',
      email: 'joao@cliente.com',
      phone: '(11) 99999-0000',
    },
  })

  // Tipo de unidade
  const suiteCasal = await db.unitType.create({
    data: {
      name: 'Suíte Casal',
      description:
        'Acomodação para 2 pessoas com cama de casal e ar-condicionado.',
      numberOfPeople: 2,
    },
  })

  // Unidade
  const unidade101 = await db.unit.create({
    data: {
      name: '101',
      typeId: suiteCasal.id,
    },
  })

  // Tarifas
  await db.rate.createMany({
    data: [
      {
        typeId: suiteCasal.id,
        name: 'Diária padrão',
        value: 250,
        numberOfPeople: 2,
      },
      {
        typeId: suiteCasal.id,
        name: 'Diária single',
        value: 180,
        numberOfPeople: 1,
      },
    ],
  })

  // Reservas com diferentes status
  const today = new Date()

  // Reserva CONFIRMED
  const bookingConfirmed = await db.booking.create({
    data: {
      guestId: guest.id,
      unitId: unidade101.id,
      startDate: today,
      endDate: addDays(today, 3),
      numberOfPeople: 2,
      totalAmount: 750,
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
    },
  })

  // Serviço lançado
  await db.service.create({
    data: {
      bookingId: bookingConfirmed.id,
      name: 'Taxa de limpeza',
      amount: 50,
    },
  })

  // Desconto lançado
  await db.discount.create({
    data: {
      bookingId: bookingConfirmed.id,
      reason: 'Desconto fidelidade',
      amount: 30,
    },
  })

  console.log('✅ Seed finalizado com sucesso.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
