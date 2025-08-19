import { getBookingById } from '@/app/actions/booking/actions'
import { getUserAndOrg } from '@/app/actions/utils/get-user-and-org'
import { formatCurrency } from '@/lib/utils'
import type { BookingAllIncludes } from '@/types/booking'
import type { Organization, Payment } from '@prisma/client'
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import dayjs from 'dayjs'
import { padStart } from 'lodash'
import type React from 'react'
import LogoPMS from '../../../public/images/LogoOndaGest.png'

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '2px solid #1e3a8a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '2px solid #1e3a8a',
  },
  logo: {
    width: 40,
    height: 40,
  },
  appName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 8,
  },
  section: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
  },
  label: {
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  footer: {
    borderTop: '1px solid #1e3a8a',
    marginTop: 12,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLogo: {
    width: 20,
    height: 20,
  },
  signature: {
    marginTop: 20,
    textAlign: 'center',
  },
})

type ReceiptDocumentProps = {
  booking: BookingAllIncludes
  payment: Payment
  organization: Organization
}

const ReceiptDocument: React.FC<ReceiptDocumentProps> = ({
  booking,
  payment,
  organization,
}) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              {organization.logoUrl && (
                <Image style={styles.logo} src={organization.logoUrl} />
              )}
              <Text style={styles.appName}>{organization.name}</Text>
            </View>
            <View>
              <Text style={styles.title}>Recibo de Pagamento</Text>
              <Text>
                Reserva #{padStart(booking.id.toString(), 5, '0')} | Pagamento #
                {payment.id}
              </Text>
            </View>
          </View>

          {/* Organização */}
          <View style={styles.section}>
            <Text style={styles.label}>Emitente:</Text>
            <Text>{organization.name}</Text>
            {organization.address && (
              <Text>
                {organization.address}, {organization.city} -{' '}
                {organization.state}
              </Text>
            )}
            {organization.zipCode && <Text>CEP: {organization.zipCode}</Text>}
            {organization.phone && <Text>Tel: {organization.phone}</Text>}
            {organization.cnpj && <Text>CNPJ: {organization.cnpj}</Text>}
            {organization.cpf && !organization.cnpj && (
              <Text>CPF: {organization.cpf}</Text>
            )}
          </View>

          {/* Destinatário */}
          <View style={styles.section}>
            <Text style={styles.label}>Recebemos de:</Text>
            <Text>{booking.guest.name}</Text>
            <Text>Email: {booking.guest.email}</Text>
            {booking.guest.phone && (
              <Text>Telefone: {booking.guest.phone}</Text>
            )}
            {booking.guest.city && <Text>Cidade: {booking.guest.city}</Text>}
          </View>

          {/* Pagamento */}
          <View style={styles.section}>
            <Text style={styles.label}>Detalhes do Pagamento:</Text>
            <Text>Valor: {formatCurrency(payment.amount)}</Text>
            <Text>Data: {dayjs(payment.paidAt).format('DD/MM/YYYY')}</Text>
            <Text>Forma: {payment.paymentType}</Text>
            <Text>
              Referente à reserva #{padStart(booking.id.toString(), 5, '0')}
            </Text>
          </View>

          {/* Assinatura */}
          <View style={styles.signature}>
            <Text>
              {organization.city}, {dayjs(payment.paidAt).format('DD/MM/YYYY')}
            </Text>
            <Text style={{ marginTop: 24 }}>Assinatura do responsável</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {organization.logoUrl && (
              <Image style={styles.logo} src={organization.logoUrl} />
            )}
            <View>
              {organization.phone && (
                <Text style={{ fontSize: 9 }}>Tel: {organization.phone}</Text>
              )}
              {organization.email && (
                <Text style={{ fontSize: 9 }}>Email: {organization.email}</Text>
              )}
              {organization.website && (
                <Text style={{ fontSize: 9 }}>
                  Site: {organization.website}
                </Text>
              )}
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}
          >
            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 9 }}>Ondagest PMS</Text>
              <Text style={{ fontSize: 9 }}>
                Documento gerado em: {dayjs().format('DD/MM/YYYY')}
              </Text>
            </View>
            <Image style={styles.footerLogo} src={LogoPMS.src} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ReceiptDocument

export async function generateReceiptDocument(payment: Payment) {
  const user = await getUserAndOrg()

  if (!user) throw new Error('Sessão não encontrada.')

  if (!user.organization) throw new Error('Organização não encontrada.')

  const { data: booking, error: bookingError } = await getBookingById(
    payment.bookingId
  )

  if (bookingError) throw new Error(bookingError)
  if (!booking) throw new Error('Reserva não encontrada')
  return (
    <ReceiptDocument
      payment={payment}
      organization={user.organization}
      booking={booking}
    />
  )
}
