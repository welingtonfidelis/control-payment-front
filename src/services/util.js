import axios from 'axios';

export default {
  async getCep (cep){
    try {
      const query = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      
      return query;
    } catch (error) {
      console.log(error);
    }
  }
}