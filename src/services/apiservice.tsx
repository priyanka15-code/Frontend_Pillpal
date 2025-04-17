import axios from 'axios';
import { Platform } from 'react-native';
import Cookies from 'js-cookie';


interface User {
  Age: number;
  Email: string;
  FullName: string;
  UserID: string; // Note: Ensure this matches the API response
  UserType: string;
  _id: string;
}

interface LoginResponse {
  status: number;
  data: string; // or you can change this to a more specific type if needed
  message: {
    accessToken: string;
    refreshToken: string;
    user: User;
    mobileNumber: {
      number: string;
      isVerified: boolean;
    };
  };
  success: boolean;
}
interface Patient {
  _id: string;
  name: string;
  profileImage?: string;
  userId: string; 
}
export interface DelegateAuthType {
  _id: {
      profileImage: string;
      _id: string;
      FullName: string;
      UserID: string;
      UserType: string;
  };
  accessAccount: string[];
}

interface Timing {
  meal?: string;
  time?: string;
  customTime?: string;
}
interface Notification {
  _id: string;
  dosage: string;
  timing: Timing[];
  medicines: {
    _id: string;
    medicineName: string;
    take: string;
  }[];
  startDate: string;
  endDate: string;
  userId: string;
  mobileNumber?: string;
  DelegatedPatientID?: string | null;
  DelegateAuthID?: string | null;
  createdAt: string;
  updatedAt: string;
}


const BASE_URL = 'https://pillpal-backend-hygo-ti49.onrender.com/api/V0'; 



  // Retrieve notifications for a user
  export const getNotifications = async (userId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/Notification/${userId}`);
      console.log('API Response for Notifications:', response.data); // Log the response
      return response.data;
    } catch (error: any) {
      console.error('Get Notifications Error:', error.response?.data || error.message);
      throw error;
    }
  };

export const AuthService = {
  signUp: async (userData: { FullName: string; Password: string; Email: string; MobileNumber: { number: string }[] }) => {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, userData, { withCredentials: true });
      const { accessToken, refreshToken } = response.data as { accessToken: string; refreshToken: string };
      Cookies.set('accessToken', accessToken, { expires: 365 });
      Cookies.set('refreshToken', refreshToken, { expires: 7 });
      return response;
    } catch (error: any) {
      throw error;
    }
  },


  verifyOTP: async (mobileNumber: string, otp: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/verify-otp`, { MobileNumber: mobileNumber, OTP: otp }, { withCredentials: true });
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  

  login: async (mobileNumber: string, password: string, navigation: any):Promise<{ data: LoginResponse }> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/login`,
        { MobileNumber: [{ number: mobileNumber }], Password: password },
        { withCredentials: true }
      );
  
      console.log("Login Response Data: ", response.data);
  
      if (response.data.success && response.data.status === 200) {
        const userData = response.data.message.user; 
        if (userData && userData._id) {
          console.log("User  ID: ", userData._id);
          navigation.navigate('HomeScreen', { userId: userData._id });
        } else {
          console.error("User  ID not found in the response.");
        }
      }
      return response;
    } catch (error: any) {
      console.error("Error during login: ", error.message);
      throw error;
    }
  
  },
  requestPasswordReset: async (email: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/requestPasswordReset`, { email });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  },

  resetPassword: async (email: string, token: string, newPassword: string) => {
    try {
      const response = await axios.put(`${BASE_URL}/resetPassword`, { email, token, password: newPassword });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  },
  getProfile: async (userId: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/${userId}`, {
        withCredentials: true,
      });
      console.log('GetProfile Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('GetProfile Error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  updateProfile: async (userId: string, profileData: any, profilePhoto?: any) => {
    try {
      const formData = new FormData();

      // Append text fields
      Object.keys(profileData).forEach((key) => {
        if (profileData[key] !== undefined && profileData[key] !== null) {
          formData.append(key, profileData[key]);
        }
      });

      // Append profile photo
      if (profilePhoto) {
        formData.append("profilePhoto", {
          uri: Platform.OS === 'android' ? profilePhoto.uri : profilePhoto.uri.replace('file://', ''),
          name: profilePhoto.fileName || 'profile.jpg',
          type: profilePhoto.type || 'image/jpeg',
        } as any);
      }

      // Debug: Log FormData fields
      Object.keys(profileData).forEach((key) => {
        console.log(`${key}: ${profileData[key]}`);
      });
      if (profilePhoto) {
        console.log("profilePhoto:", profilePhoto);
      }

      // Send request
      const response = await axios.put(`${BASE_URL}/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile update response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Profile update error:", error.response?.data || error.message || error);
      throw error;
    }
  },


};




export const Controller = {
  // Add new patient or auth user
  addPatientOrAuthUser: async (_id: string, FullName: string, Email: string, Password: string, MobileNumber: { number: string }[], UserType: string, DelegateAuthID: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/add/${_id}`, { FullName, Email, Password, MobileNumber, UserType, DelegateAuthID });
      return response.data;
    } catch (error: any) {
      console.error('Add Patient/Auth User Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update user by ID
  updateUser: async (_id: string, FullName: string, Email: string, Password: string, MobileNumber: string, UserType: string, DelegateAuthID: string, DelegatedPatientID: string) => {
    try {
      const response = await axios.put(`${BASE_URL}/add/${_id}`, { FullName, Email, Password, MobileNumber, UserType, DelegateAuthID, DelegatedPatientID });
      return response.data;
    } catch (error: any) {
      console.error('Update User Error:', error.response?.data || error.message);
      throw error;
    }
  },
  getPatient: async (userId: string): Promise<Patient[]> => { 
    try {
      console.log('User  ID sent to API:', userId); 
      const url = `${BASE_URL}/add/${userId}/patient`;
      console.log(`Fetching patients from: ${url}`);
      
      const response = await axios.get(url); 
      console.log('API Response:', response.data);
      
      const data = response.data as { patients: any[] };
      
      if (data && Array.isArray(data.patients)) {
        return data.patients.map(patient => ({
          userId: patient._id.UserID, 
          _id: patient._id._id, 
          name: patient._id.FullName, 
          profileImage: '' 
         
        }));
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error: any) {
      console.error('Get Patient Error:', error.response?.data || error.message);
      throw error;
    }
  },


 getParticularPatientasync: async (userId: string, patientId: string): Promise<any> => {
  try {
    const response = await axios.get<{
      patientDetails: {
        patientInfo: {
          _id: string;
          FullName: string;
          Email: string;
          MobileNumber?: { number: string; isVerified: boolean }[];
          CreatedBy: string;
          UserType: string;
          DelegateAuthID?: string[];
          Folders?: {
            folderName: string;
            folderAccess: {
              DelegateFolderAuthID: string;
              FullName?: string;
              MobileNumber?: { number: string; isVerified: boolean }[];
              AccessFolderID: string[];
            }[];
            files: {
              fileName: string;
              fileType: string;
              filePath: string;
              fileAccess: {
                AccessfileID: string;
                FullName?: string;
                MobileNumber?: { number: string; isVerified: boolean }[];
              }[];
            }[];
          }[];
          UserID: string;
          createdAt: string;
          updatedAt: string;
        };
        accessAccount?: {
          _id: string;
          FullName: string;
          Email: string;
          MobileNumber: { number: string; isVerified: boolean }[];
          accessAccount: string[];
        }[];
      };
    }>(`${BASE_URL}/add/${userId}/${patientId}`);

    const patientDetails = response.data.patientDetails;

    const patientInfo = patientDetails.patientInfo;

    return {
      userId: patientInfo.UserID,
      _id: patientInfo._id,
      name: patientInfo.FullName,
      email: patientInfo.Email,
      mobileNumber: patientInfo.MobileNumber ?? [],
      createdBy: patientInfo.CreatedBy,
      userType: patientInfo.UserType,
      delegateAuthID: patientInfo.DelegateAuthID ?? [],
      folders: patientInfo.Folders?.map((folder) => ({
        folderName: folder.folderName,
        folderAccess: folder.folderAccess.map((access) => ({
          delegateFolderAuthID: access.DelegateFolderAuthID,
          fullName: access.FullName ?? 'No Name Available',
          mobileNumber: access.MobileNumber ?? [],
          accessFolderID: access.AccessFolderID,
        })),
        files: folder.files.map((file) => ({
          fileName: file.fileName,
          fileType: file.fileType,
          filePath: file.filePath,
          fileAccess: file.fileAccess.map((access) => ({
            accessFileID: access.AccessfileID,
            FullName: access.FullName ?? 'No Name Available',
            mobileNumber: access.MobileNumber ?? [],
          })),
        })),
      })) ?? [],
      accessAccount: patientDetails.accessAccount ?? [],
      createdAt: patientInfo.createdAt,
      updatedAt: patientInfo.updatedAt,
    };
  } catch (error: any) {
    console.error('Get Particular Patient Error:', error.response?.data || error.message);
    throw error;
  }
},

  
  

  
  

  getAuth: async (userId: string): Promise<Patient[]> => { 
    try {
      console.log('User ID sent to API:', userId); 
      const url = `${BASE_URL}/add/${userId}`;  
      console.log(`Fetching patients from: ${url}`);
      
      const response = await axios.get(url); 
      console.log('API Response:', response.data);
      
      const data = response.data as { Auth: any[] };
      
      if (data && Array.isArray(data.Auth)) {
        return data.Auth.map(authItem => {
          const user = authItem._id; // This is the user object from your backend
          return {
            userId: user.UserID,
            _id: user._id,
            name: user.FullName,
            profileImage: ''
          };
        });
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error: any) {
      console.error('Get Patient Error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  
  // Delete user by ID
  deleteUser: async (_id: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/add/${_id}`);
      return response.data;
    } catch (error: any) {
      console.error("Delete User Error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export const Folder = {
 
  createFolder: async (userId: string, data: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/folder/${userId}`, data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            console.error('Create Folder Error:', error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
            console.error('Create Folder Error:', error.message);
            throw new Error('An error occurred while creating the folder.');
        }
    }
},

  // Update Folder Details
  updateFolder: async (userId: string, folderId: string, data: any) => {
    try {
      const response = await axios.put(`${BASE_URL}/folder/${userId}/${folderId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update Folder Error:', error);
      throw error;
    }
  },

  // Delete a Folder
  deleteFolder: async (userId: string, folderId: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/folder/${userId}/${folderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete Folder Error:', error);
      throw error;
    }
  },

  // Get a Single Folder by ID
  getFolder: async (userId: string, folderId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/folder/${userId}/${folderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get Folder Error:', error);
      throw error;
    }
  },

  getAllFolders: async (_id: string) => {
    if (!_id) {
      throw new Error('User  ID is required.');
    }
  
    try {
      console.log('Fetching folders for user ID:', _id);
      const response = await axios.get(`${BASE_URL}/Folder/${_id}`);
      console.log('API Response:', response.data);
      
      if (response.data) {
        return response.data;
      } else {
        throw new Error('No data returned from server.');
      }
    } catch (error: any) {
      console.error('Get All Folders Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};
export const addFileToFolder = async (userId: string, folderId: string, fileData: FormData) => {
  try {
    const response = await axios.post(`${BASE_URL}/file/${userId}/${folderId}`, fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error adding file to folder:', error.message);
    throw error;
  }
};

// Get File from Folder
export const getAllFileFromFolder = async (userId: string, folderId: string, ) => {
  try {
    const response = await axios.get(`${BASE_URL}/file/${userId}/${folderId}`);
    console.log("file",response.data)
    return response.data;
   
  } catch (error: any) {
    console.error('Error fetching file from folder:', error.message);
    throw error;
  }
};

// Get File from Folder
export const getAllFiledetails = async (userId: string, folderId: string, fileId: string ) => {
  try {
    const response = await axios.get(`${BASE_URL}/file/${userId}/${folderId}/${fileId}`);
    console.log("file",response.data)
    return response.data;
   
  } catch (error: any) {
    console.error('Error fetching file from folder:', error.message);
    throw error;
  }
};

// Update File in Folder
export const updateFileInFolder = async (userId: string, folderId: string, fileId: string, fileData: FormData) => {
  try {
    const response = await axios.put(`${BASE_URL}/file/${userId}/${folderId}/${fileId}`, fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating file in folder:', error.message);
    throw error;
  }
};

// Delete File from Folder
export const deleteFileFromFolder = async (userId: string, folderId: string, fileId: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/file/${userId}/${folderId}/${fileId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting file from folder:', error.message);
    throw error;
  }
};


export const NotificationService = {
  // Add a new notification
  addNotification: async (userId: string, notificationData: any) => {
    try {
      const response = await axios.post(`${BASE_URL}/Notification/${userId}`, notificationData);
      return response.data;
    } catch (error: any) {
      console.error('Add Notification Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update a notification
  updateNotification: async (userId: string, notificationId: string, notificationData: any) => {
    try {
      const response = await axios.put(`${BASE_URL}/Notification/${userId}/${notificationId}`, notificationData);
      return response.data;
    } catch (error: any) {
      console.error('Update Notification Error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}/Notification/${notificationId}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete Notification Error:', error.response?.data || error.message);
      throw error;
    }
  },

  getNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      const response = await axios.get<Notification[]>(`${BASE_URL}/Notification/${userId}`);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get Notifications Error:', error.response?.data || error.message);
      throw error;
    }
  }
  
};