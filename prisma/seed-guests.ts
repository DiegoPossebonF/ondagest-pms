import db from '@/lib/db'
import { faker } from '@faker-js/faker/locale/pt_BR'

async function main() {
  console.log('🌱 Iniciando seed dos hóspedes...')

  const guests = Array.from({ length: 20 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number(),
    cpf: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
    city: faker.location.city(),
    carPlate: faker.vehicle.vrm(),
    createdAt: faker.date.between({
      from: '2024-01-01T00:00:00.000Z',
      to: '2025-06-01T00:00:00.000Z',
    }),
  }))

  await db.guest.createMany({
    data: guests,
  })

  console.log('✅ Seed concluído!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    db.$disconnect()
  })
