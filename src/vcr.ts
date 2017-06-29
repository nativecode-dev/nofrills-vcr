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

export interface Formatter {
  (args: any[]): any[]
}

export interface Tape {
  (frame: Frame): void
}

export class VCR {
  private readonly formatters: Formatter[] = []
  private readonly writers: Tape[] = []
  protected readonly tag: string

  constructor(tag: string) {
    this.tag = tag
  }

  public extend(tag: string): VCR {
    return new VCR(this.namespace(tag))
  }

  public debug(...args: any[]): VCR {
    return this.write('debug', ...args)
  }

  public error(...args: any[]): VCR {
    return this.write('error', ...args)
  }

  public formatter(formatter: Formatter): VCR {
    this.formatters.push(formatter)
    return this
  }

  public info(...args: any[]): VCR {
    return this.write('info', ...args)
  }

  public use(handler: Tape): VCR {
    this.writers.push(handler)
    return this
  }

  public warn(...args: any[]): VCR {
    return this.write('warn', ...args)
  }

  private namespace(tag: string): string {
    return `${this.tag}:${tag}`
  }

  private write(tag: string, ...args: any[]): VCR {
    const frame: Frame = {
      args,
      id: uuid.v4(),
      logdate: Date.now(),
      tag: this.namespace(tag),
    }

    this.formatters
      .forEach((formatter: Formatter) => frame.args = formatter(frame.args))

    this.writers
      .forEach((tape: Tape) => tape(frame))

    return this
  }
}
