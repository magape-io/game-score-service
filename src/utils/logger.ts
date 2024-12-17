import { join } from 'path'
import { createWriteStream } from 'fs'
import { appConfig } from '../config/app.config'

export const logStream = createWriteStream(
  join(__dirname, '../../', appConfig.logger.file),
  { flags: 'a' }
)

export const loggerConfig = {
  level: appConfig.logger.level,
  stream: logStream,
  serializers: {
    req(request: any) {
      return {
        method: request.method,
        url: request.url,
        hostname: request.hostname,
        remoteAddress: request.ip,
        remotePort: request.socket.remotePort
      }
    }
  }
}
