import api from "../api";

export const fetchProducts = async () => { 
    const res = await api.get("/products"); 
    return res.data; 
};