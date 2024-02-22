/*
import * as Papa from 'papaparse';

export class CsvLoader {
    private url: string;
  
    constructor(url: string) {
      this.url = url;
    }
  
    async load(): Promise<any[]> {
      return new Promise<any[]>((resolve, reject) => {
        Papa.parse(this.url, {
          download: true,
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (result) => {
            if (result.data) {
              resolve(result.data);
            } else {
              reject(new Error('CSV parsing error'));
            }
          },
          error: (error) => {
            reject(error.message || 'Error parsing CSV');
          },
        });
      });
    }
  }
  
  // Example usage with await:
  async function main() {
    const csvUrl = './data/itemcoords.csv';
    const csvLoader = new CsvLoader(csvUrl);
  
    try {
      const data = await csvLoader.load();
      console.log('CSV data:', data);
    } catch (error) {
      console.error('Error loading CSV:', error);
    }
  }  
  
  */
  
