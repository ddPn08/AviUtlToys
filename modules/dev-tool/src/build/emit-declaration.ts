import kleur from 'kleur'
import path from 'path'
import { replaceTscAliasPaths } from 'tsc-alias'
import typescript, { CompilerOptions } from 'typescript'

export const emitDeclaration = (
    files: string[],
    cwd: string,
    outDir: string,
    options: CompilerOptions,
    tsconfigPath?: string,
) => {
    /**
     * Emit declaration files
     */
    const compilerOptions: CompilerOptions = {
        esModuleInterop: true,
        declaration: true,
        declarationDir: outDir,
        emitDeclarationOnly: true,
    }
    
    const program = typescript.createProgram(files, compilerOptions)
    const emitResult = program.emit()
    const diagnostics = typescript.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
    diagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
            const { line, character } = typescript.getLineAndCharacterOfPosition(
                diagnostic.file,
                diagnostic.start!,
            )
            const msg = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
            console.log(
                kleur.red('DTS'),
                `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${msg}`,
            )
        } else {
            console.log(
                kleur.red('DTS'),
                `${typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
            )
        }
    })
    replaceTscAliasPaths({
        configFile: tsconfigPath || path.join(cwd, 'tsconfig.json'),
        ...options,
    })
}
