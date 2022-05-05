import path from 'path'
import { replaceTscAliasPaths } from 'tsc-alias'
import typescript from 'typescript'

/**
 * @param {string[]} files
 * @param {string} cwd
 * @param {string} outDir
 * @param {import('typescript').CompilerOptions} options
 */
export const emitDeclaration = (files, cwd, outDir, options) => {
  /**
   * Emit declaration files
   */
  const program = typescript.createProgram(files, {
    esModuleInterop: true,
    declaration: true,
    declarationDir: outDir,
    emitDeclarationOnly: true,
    ...options,
  })
  const emitResult = program.emit()
  const diagnostics = typescript.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
  if (diagnostics.length < 1) console.log(`declaration files emitted`)
  diagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = typescript.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start,
      )
      const msg = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${msg}`)
    } else {
      console.log(`${typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`)
    }
  })
  replaceTscAliasPaths({
    configFile: path.join(cwd, 'tsconfig.json'),
  })
}
