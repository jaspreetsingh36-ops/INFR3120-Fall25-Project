// This service can be used later when HttpClient is properly configured
export class ApiService {
  private apiUrl = 'https://autorent-k8dr.onrender.com/api';
  
  // This will be implemented when HttpClient is available
  async testConnection(): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/cars`);
      return await response.json();
    } catch (error) {
      console.error('Connection error:', error);
      return null;
    }
  }
  
  async getCars(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiUrl}/cars`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      return [];
    }
  }
}
