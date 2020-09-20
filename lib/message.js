import chalk from 'chalk'

export const errorMessage = (msg) => {
    return chalk.red(`Error: ${msg}`)
}

export const warningMessage = (msg) => {
    return chalk.yellow(`Warning: ${msg}`)
}

export const infoMessage = (msg) => {
    return chalk.white(`Info: ${msg}`)
}

export const successMessage = (msg) => {
    return chalk.green(`Success: ${msg}`)
}
