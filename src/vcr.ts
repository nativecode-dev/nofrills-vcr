import * as debug from 'debug'
import * as uuid from 'uuid'

export const Console = (frame: Frame): void => {
  console.log(frame.tag, ...frame.args)
}

export const Debug = (frame: Frame): void => {
  const logger: debug.IDebugger = debug(frame.tag)
  logger(frame.args)
}

export interface Frame {
  args: any[]
  id: string
  logdate: number
  tag: string
}

export interface Tape {
  (frame: Frame): void
}

export class VCR {
  private readonly writers: Tape[] = []
  protected readonly tag: string

  constructor(tag: string) {
    this.tag = tag
  }

  public use(writer: Tape): VCR {
    this.writers.push(writer)
    return this
  }

  public debug(...args: any[]): VCR {
    return this.write('debug', ...args)
  }

  public error(...args: any[]): VCR {
    return this.write('error', ...args)
  }

  public info(...args: any[]): VCR {
    return this.write('info', ...args)
  }

  public warn(...args: any[]): VCR {
    return this.write('warn', ...args)
  }

  private write(tag: string, ...args: any[]): VCR {
    const frame: Frame = {
      args,
      id: uuid.v4(),
      logdate: Date.now(),
      tag: `${this.tag}:${tag}`,
    }
    this.writers.forEach(writer => writer(frame))
    return this
  }
}

export default (tag: string): VCR => new VCR(tag)
