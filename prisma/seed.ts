'use server'
import db from '@/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)

  const admin = await db.user.create({
    data: {
      name: 'Admin',
      email: 'admin@exemplo.com',
      password: passwordHash,
      role: 'ADMIN',
      emailVerified: null,
      image: '',
    },
  })

  await db.organization.create({
    data: {
      name: 'Minha Pousada Inicial',
      email: 'contato@pousada.com',
      phone: '(11) 98765-4321',
      address: 'Rua Principal, 123',
      city: 'Cidade Exemplo',
      state: 'SP',
      zipCode: '12345-678',
      country: 'Brasil',
      cpf: null,
      cnpj: '12.345.678/0001-99',
      logoUrl: '',
      invoiceMessageVoucher: 'Agradecemos sua reserva!',
      invoiceMessageReceipt: 'Obrigado por se hospedar conosco!',
    },
  })

  console.log('Seed concluído com sucesso!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
