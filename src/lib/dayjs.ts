import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/pt-br'

// Habilita plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

// Configura locale e fuso horário padrão (ex: São Paulo)
dayjs.locale('pt-br')
dayjs.tz.setDefault('America/Sao_Paulo')

export default dayjs
