import axios from "axios"

axios.defaults.baseURL = "http://" + localStorage.getItem('host');


// + localStorage.getItem('host');
