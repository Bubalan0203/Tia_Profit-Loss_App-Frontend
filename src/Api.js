import axios from "axios"
export async function postData(url, newData, headers) {
    try {
      const response = await axios.post(url, newData, {
        headers: {
          Authorization: `Bearer ${headers.userToken}`,
          role: headers.userRole,
        },
      });
      enqueueSnackbar("added successfully",{variant:'success'})
      return response.data;
    } catch (error) {
      console.log(error);
      //enqueueSnackbar(error.response.data.message,{variant:'error'});
      console.error("Error creating data:", error);
      throw error;
    }
  }