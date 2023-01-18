import { ensureDir, writeFile } from 'fs-extra'
import { path } from 'app-root-path'
import { Injectable } from '@nestjs/common'
import { FileResponseInterface } from './interface/file.interface'

@Injectable()
export class FileService {
	async saveFiles(
		files: Express.Multer.File[],
		folder: string = 'default'
	): Promise<FileResponseInterface[]> {
		const uploadFolder = `${path}/uploads/${folder}`
		await ensureDir(uploadFolder)

		const response: FileResponseInterface[] = await Promise.all(
			files.map(async (file) => {
				await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)
				return {
					url: `/uploads/${folder}/${file.originalname}`,
					name: file.originalname,
				}
			})
		)

		return response
	}
}
