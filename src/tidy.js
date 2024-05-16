import { readdir, mkdir, rename } from 'node:fs/promises';
import { lstatSync, existsSync } from 'node:fs';
import path from 'node:path';

const isFile = (fullPath) => {
  return lstatSync(fullPath).isFile();
};

async function createFolder(folderPath) {
  // if folder is not exists
  if (!existsSync(folderPath)) {
    await mkdir(folderPath);
  }
}

function isSupportedFileType(fileType) {
  switch (fileType) {
    case '.zip':
    case '.tar':
    case '.rar':
      return 'archive';
    case '.jpg':
    case '.jpeg':
    case '.png':
      return 'image';
    default:
      return false;
  }
}

async function tidingFiles(baseFolder) {
  try {
    // 1. read files only
    const dirContent = await readdir(baseFolder);
    const files = dirContent.filter((dc) => isFile(path.join(baseFolder, dc)));

    if (files.length <= 0) return { status: 'fail', message: 'Folder is empty.' };

    // 2. detect files type
    for (const file of files) {
      const isSupport = isSupportedFileType(path.extname(file));

      // 3. create folder based on group files type support [archive, image]
      // only create folder when file that support is exists
      if (isSupport) {
        if (isSupport === 'archive') {
          await createFolder(path.join(baseFolder, 'archives'));
          // 4. move file to folder target
          await rename(path.join(baseFolder, file), path.join(baseFolder, 'archives', file));
        }

        if (isSupport === 'image') {
          await createFolder(path.join(baseFolder, 'images'));
          await rename(path.join(baseFolder, file), path.join(baseFolder, 'images', file));
        }
      }
    }

    return { status: 'success' };
  } catch (error) {
    console.log(error);
  }
}

export { tidingFiles };
