import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/pt-br'

// Habilita plugins
dayjs.extend(utc)
dayjs.extend(timezone)

// Configura locale e fuso horário padrão (ex: São Paulo)
dayjs.locale('pt-br')
dayjs.tz.setDefault('America/Sao_Paulo')

export default dayjs
