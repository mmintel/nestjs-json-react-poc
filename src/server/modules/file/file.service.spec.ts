import { Test } from '@nestjs/testing';
import { FileService } from './file.service';
import { vol } from 'memfs';

// eslint-disable-next-line global-require
jest.mock('fs', () => require('memfs'));

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(async () => {
    vol.reset();

    const moduleRef = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    fileService = await moduleRef.get<FileService>(FileService);
  });

  describe('get', () => {
    describe('gets a single json file from storage', () => {
      test('gets a json object', async () => {
        const mockFile = JSON.stringify({ title: 'foo', bar: { baz: 'test' } });
        vol.fromJSON(
          {
            './documents.json': mockFile,
          },
          '/content',
        );
        const file = await fileService.readFile('/content/documents.json');
        expect(file).toEqual(mockFile);
      });

      // test('reads the file without extension', async () => {
      //   const mockFile = { title: 'Document' };
      //   vol.fromJSON(
      //     {
      //       './documents.json': JSON.stringify(mockFile),
      //     },
      //     '/content',
      //   );
      //   const file = await jsonService.get('/content/documents');
      //   expect(file).toEqual(mockFile);
      // });

      // test('returns null for non-existent files', async () => {
      //   vol.fromJSON({}, '/content');
      //   const file = await jsonService.get('/content/documents');
      //   expect(file).toEqual(null);
      // });
    });
  });

  // describe('readDir', () => {
  //   describe('when not recursive', () => {
  //     describe('reads all json files from storage', () => {
  //       test('all jsons', async () => {
  //         const mockFile1 = { id: 1 };
  //         const mockFile2 = { id: 2 };
  //         const mockFile3 = { id: 3 };

  //         vol.fromJSON(
  //           {
  //             './foo.json': JSON.stringify(mockFile1),
  //             './bar.json': JSON.stringify(mockFile2),
  //             './baz.json': JSON.stringify(mockFile3),
  //           },
  //           '/content',
  //         );

  //         const files = await jsonService.readDir('/content');
  //         expect(files).toContainEqual(mockFile1);
  //         expect(files).toContainEqual(mockFile2);
  //         expect(files).toContainEqual(mockFile3);
  //       });

  //       test('only jsons', async () => {
  //         const mockFile1 = { id: 1 };
  //         const mockFile2 = { id: 2 };
  //         const mockFile3 = { id: 3 };

  //         vol.fromJSON(
  //           {
  //             './foo.json': JSON.stringify(mockFile1),
  //             './bar.txt': JSON.stringify(mockFile2),
  //             './baz.json': JSON.stringify(mockFile3),
  //           },
  //           '/content',
  //         );

  //         const files = await jsonService.readDir('/content');
  //         expect(files).toContainEqual(mockFile1);
  //         expect(files).toContainEqual(mockFile3);
  //         expect(files).not.toContainEqual(mockFile2);
  //       });

  //       test('ignores nested jsons', async () => {
  //         const mockFile1 = { id: 1 };
  //         const mockFile2 = { id: 2 };
  //         const mockFile3 = { id: 3 };

  //         vol.fromJSON(
  //           {
  //             './foo.json': JSON.stringify(mockFile1),
  //             './bar.json': JSON.stringify(mockFile2),
  //             './foo/baz.json': JSON.stringify(mockFile3),
  //           },
  //           '/content',
  //         );

  //         const files = await jsonService.readDir('/content');
  //         expect(files).toContainEqual(mockFile1);
  //         expect(files).toContainEqual(mockFile2);
  //         expect(files).not.toContainEqual(mockFile3);
  //       });
  //     });

  //     describe('when recursive', () => {
  //       test('reads nested jsons', async () => {
  //         const mockFile1 = { id: 1 };
  //         const mockFile2 = { id: 2 };
  //         const mockFile3 = { id: 3 };

  //         vol.fromJSON(
  //           {
  //             './foo.json': JSON.stringify(mockFile1),
  //             './bar.json': JSON.stringify(mockFile2),
  //             './foo/baz.json': JSON.stringify(mockFile3),
  //           },
  //           '/content',
  //         );

  //         const files = await jsonService.readDir('/content', true);
  //         expect(files).toContainEqual(mockFile1);
  //         expect(files).toContainEqual(mockFile2);
  //         expect(files).toContainEqual(mockFile3);
  //       });
  //     });
  //   });
  // });
});
