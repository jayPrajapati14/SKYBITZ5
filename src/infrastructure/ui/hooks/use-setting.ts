import { useQuery } from "@tanstack/react-query";
const API_URL = import.meta.env.VITE_API_URL;

const getSetting = async () => {
  try {
    const res = await  fetch(`${API_URL}/api/v1/user/settings`)
    const data = await res.json();
    console.log( "MYDATA" , data)
    return data;
  } catch (error) {
    console.log(error);
  }
};

// const postSetting = async( group: string , name : string , value : boolean ) => {
//     try{
//        const res = await 
//     }catch(error){

//     }
// }

export const useUserSetting = ()=>{
    return useQuery({
        queryKey:["setting"],
        queryFn: async ()=> getSetting()
    })
}
