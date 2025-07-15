'use client'

import { STATUS_LABELS, formatCurrency } from '@/lib/utils'
import LogoPMS from '@/public/images/LogoOndaGest.png'
import type { BookingAllIncludes } from '@/types/booking'
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

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 11,
    fontFamily: 'Helvetica',
    border: '2px solid #1e3a8a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '2px solid #1e3a8a',
  },
  logo: {
    width: 40,
    height: 40,
  },
  appName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  small: {
    fontSize: 9,
    color: '#666',
  },
  section: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
  },
  label: {
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  footer: {
    borderTop: '1px solid #1e3a8a',
    marginTop: 20,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLogo: {
    width: 20,
    height: 20,
  },
})

type VoucherDocumentProps = {
  booking: BookingAllIncludes
  hotelName: string
  hotelLogo: string
  hotelContact: {
    phone?: string
    email?: string
    website?: string
  }
}

const VoucherDocument: React.FC<VoucherDocumentProps> = ({
  booking,
  hotelName,
  hotelLogo,
  hotelContact,
}) => {
  const totalServices = booking.services.reduce((acc, s) => acc + s.amount, 0)
  const totalDiscounts = booking.discounts.reduce((acc, d) => acc + d.amount, 0)
  const subtotal = booking.totalAmount + totalServices - totalDiscounts
  const totalPaid = booking.payments.reduce((acc, p) => acc + p.amount, 0)
  const remaining = subtotal - totalPaid

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {/* Header */}
          <View style={styles.header}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Image style={styles.logo} src={hotelLogo} />
              <Text style={styles.appName}>{hotelName}</Text>
            </View>
            <View>
              <Text style={styles.title}>Voucher de Reserva</Text>
              <Text style={styles.small}>
                Reserva #{padStart(booking.id.toString(), 5, '0')}
              </Text>
            </View>
          </View>

          {/* Hóspede */}
          <View style={styles.section}>
            <Text style={styles.label}>Hóspede:</Text>
            <Text>
              {booking.guest.name} - {booking.guest.email}
            </Text>
            {booking.guest.phone && <Text>Tel: {booking.guest.phone}</Text>}
            {booking.guest.city && <Text>Cidade: {booking.guest.city}</Text>}
          </View>

          {/* Unidade */}
          <View style={styles.section}>
            <Text style={styles.label}>Unidade Reservada:</Text>
            <Text>
              {booking.unit.name} ({booking.unit.type.name})
            </Text>
            <Text>Capacidade: {booking.unit.type.numberOfPeople} pessoas</Text>
            <Text>
              {`Reserva para até ${booking.numberOfPeople} pessoa(s).`}
            </Text>
          </View>

          {/* Datas */}
          <View style={styles.section}>
            <Text style={styles.label}>Período:</Text>
            <Text>
              {dayjs(booking.startDate).format('DD/MM/YYYY')} até{' '}
              {dayjs(booking.endDate).format('DD/MM/YYYY')}.
            </Text>
            <Text>
              {`Total de ${dayjs(booking.endDate).diff(booking.startDate, 'days')} diária(s).`}
            </Text>
            <Text>Status: {STATUS_LABELS[booking.status]}</Text>
          </View>

          {/* Financeiro */}
          <View style={styles.section}>
            <Text style={styles.label}>Resumo Financeiro:</Text>
            <View style={styles.row}>
              <Text>Hospedagem:</Text>
              <Text>{`${dayjs(booking.endDate).diff(booking.startDate, 'days')} diária(s) x ${formatCurrency(booking.daily || 0)} = ${formatCurrency(booking.totalAmount)}`}</Text>
            </View>
            <View style={styles.row}>
              <Text>Serviços:</Text>
              <Text>R$ {totalServices.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text>Descontos:</Text>
              <Text>- R$ {totalDiscounts.toFixed(2)}</Text>
            </View>
            <View style={[styles.row, { alignItems: 'center' }]}>
              <Text />
              <Text
                style={{ borderTop: '1px solid #2e2e2e', width: '100px' }}
              />
            </View>
            <View style={styles.row}>
              <Text>Valor total:</Text>
              <Text>R$ {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text>Total Pago:</Text>
              <Text>R$ {totalPaid.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text>Saldo Restante:</Text>
              <Text>R$ {remaining.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Image style={styles.logo} src={hotelLogo} />
            <View>
              {hotelContact.phone && (
                <Text style={styles.small}>Tel: {hotelContact.phone}</Text>
              )}
              {hotelContact.email && (
                <Text style={styles.small}>Email: {hotelContact.email}</Text>
              )}
              {hotelContact.website && (
                <Text style={styles.small}>Site: {hotelContact.website}</Text>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              gap: 6,
            }}
          >
            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
              <Text style={styles.small}>Ondagest PMS</Text>
              <Text style={styles.small}>
                Documento criado em: {dayjs().format('DD/MM/YYYY')}
              </Text>
            </View>
            <Image style={styles.footerLogo} src={LogoPMS.src} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default VoucherDocument
