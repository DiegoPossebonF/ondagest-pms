'use client'

import type { Organization } from '@/app/generated/prisma'
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
    padding: 15,
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
  organization: Organization
}

const VoucherDocument: React.FC<VoucherDocumentProps> = ({
  booking,
  organization,
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
              {organization.logoUrl && (
                <Image style={styles.logo} src={organization.logoUrl} />
              )}
              <Text style={styles.appName}>{organization.name}</Text>
            </View>
            <View>
              <Text style={styles.title}>Voucher de Reserva</Text>
              <Text style={styles.small}>
                Reserva #{padStart(booking.id.toString(), 5, '0')}
              </Text>
            </View>
          </View>

          {/* Organização */}
          <View style={styles.section}>
            <Text style={styles.label}>Informações do Estabelecimento:</Text>
            {organization.address && (
              <Text>
                Endereço: {organization.address}, {organization.city} -{' '}
                {organization.state}, {organization.zipCode}
              </Text>
            )}
            <Text>
              {organization.cnpj
                ? `CNPJ: ${organization.cnpj}`
                : organization.cpf
                  ? `CPF: ${organization.cpf}`
                  : 'Documento não informado'}
            </Text>
            {organization.phone && <Text>Telefone: {organization.phone}</Text>}
            {organization.email && <Text>Email: {organization.email}</Text>}
            {organization.website && (
              <Text>Website: {organization.website}</Text>
            )}
            {organization.instagram && (
              <Text>Instagram: @{organization.instagram}</Text>
            )}
            {organization.facebook && (
              <Text>Facebook: {organization.facebook}</Text>
            )}
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
              {dayjs(booking.endDate).format('DD/MM/YYYY')}
            </Text>
            <Text>
              {`Total de ${dayjs(booking.endDate).diff(
                booking.startDate,
                'days'
              )} diária(s).`}
            </Text>
            <Text>Status: {STATUS_LABELS[booking.status]}</Text>
          </View>

          {/* Financeiro */}
          <View style={styles.section}>
            <Text style={styles.label}>Resumo Financeiro:</Text>
            <View style={styles.row}>
              <Text>Hospedagem:</Text>
              <Text>{`${dayjs(booking.endDate).diff(
                booking.startDate,
                'days'
              )} diária(s) x ${formatCurrency(booking.daily || 0)} = ${formatCurrency(
                booking.totalAmount
              )}`}</Text>
            </View>
            <View style={styles.row}>
              <Text>Serviços:</Text>
              <Text>{formatCurrency(totalServices)}</Text>
            </View>
            <View style={styles.row}>
              <Text>Descontos:</Text>
              <Text>- {formatCurrency(totalDiscounts)}</Text>
            </View>
            <View style={[styles.row, { alignItems: 'center' }]}>
              <Text />
              <Text
                style={{ borderTop: '1px solid #2e2e2e', width: '100px' }}
              />
            </View>
            <View style={styles.row}>
              <Text>Valor total:</Text>
              <Text>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.row}>
              <Text>Total Pago:</Text>
              <Text>{formatCurrency(totalPaid)}</Text>
            </View>
            <View style={styles.row}>
              <Text>Saldo Restante:</Text>
              <Text>{formatCurrency(remaining)}</Text>
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
            {organization.logoUrl && (
              <Image style={styles.logo} src={organization.logoUrl} />
            )}
            <View>
              {organization.phone && (
                <Text style={styles.small}>Tel: {organization.phone}</Text>
              )}
              {organization.email && (
                <Text style={styles.small}>Email: {organization.email}</Text>
              )}
              {organization.website && (
                <Text style={styles.small}>Site: {organization.website}</Text>
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
