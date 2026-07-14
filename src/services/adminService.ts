import apiClient, { emitApiError } from "./apiClient";
import { Users } from "interfaces/Admin";
import { CategoryInfo } from "interfaces/Category";

interface FetchOptions {
  token: string;
  logout: () => void;
}

const SERVICE_BASE_URL = "/user";

export async function fetchUserList({ token, logout }: FetchOptions): Promise<Users[] | null> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      logout();
      return null;
    }
    const userInfo = response.data.utilisateurs as Users[];
    return userInfo;
  } catch (error: any) {
    emitApiError("Erreur lors de la récupération des utilisateurs", error.status ?? 500);
    return null;
  }
}

export async function enableUser({ token, logout }: FetchOptions,cip: string | undefined, data: Partial<Users>) {
    try {
        const response = await apiClient.put(`${SERVICE_BASE_URL}/${cip}/enable`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return null;
        } 
        return response.data as Users;
    } catch (error: any) {
        emitApiError("Erreur lors de l'activation de l'utilisateur", error.status ?? 500);
        return null;
  }
}

export async function disableUser({ token, logout }: FetchOptions, cip: string | undefined, data: Partial<Users>) {

    try {
        const response = await apiClient.put(`${SERVICE_BASE_URL}/${cip}/disable`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return null;
        }
        return response.data as Users;
    } catch (error: any) {
        emitApiError("Erreur lors de la désactivation de l'utilisateur", error.status ?? 500);
        return null;
    }
}

export async function fetchCategoryList({ token, logout }: FetchOptions): Promise<CategoryInfo[] | null> {
  try {
    const response = await apiClient.get(`category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      logout();
      return null;
    }
    return response.data as CategoryInfo[];;
  } catch (error: any) {
    emitApiError("Erreur lors de la récupération des catégories", error.status ?? 500);
    return null;
  }
}

export async function createCategory({ token, logout }: FetchOptions, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.post(`category`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la création de la catégorie", error.status ?? 500);
        return false;
  }
}

export async function updateCategory({ token, logout }: FetchOptions, id: number, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.put(`category/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la mise à jour de la catégorie", error.response?.status ?? 500);
        return false;
    }
}

export async function deleteCategory({ token, logout }: FetchOptions, id: number): Promise<boolean> {
    try {
        const response = await apiClient.delete(`category/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la suppression de la catégorie", error.response?.status ?? 500);
        return false;
    }
}

export async function fetchDeliveryOptionList({ token, logout }: FetchOptions): Promise<CategoryInfo[] | null> {
  try {
    const response = await apiClient.get(`deliveryOption`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      logout();
      return null;
    }
    return response.data as CategoryInfo[];;
  } catch (error: any) {
    emitApiError("Erreur lors de la récupération des options de livraison", error.status ?? 500);
    return null;
  }
}

export async function createDeliveryOption({ token, logout }: FetchOptions, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.post(`deliveryOption`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la création de l'option de livraison", error.status ?? 500);
        return false;
  }
}

export async function updateDeliveryOption({ token, logout }: FetchOptions, id: number, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.put(`deliveryOption/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la mise à jour de l'option de livraison", error.response?.status ?? 500);
        return false;
    }
}

export async function deleteDeliveryOption({ token, logout }: FetchOptions, id: number): Promise<boolean> {
    try {
        const response = await apiClient.delete(`deliveryOption/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la suppression de l'option de livraison", error.response?.status ?? 500);
        return false;
    }
}

export async function fetchPaymentOptionList({ token, logout }: FetchOptions): Promise<CategoryInfo[] | null> {
  try {
    const response = await apiClient.get(`paymentOption`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      logout();
      return null;
    }
    return response.data as CategoryInfo[];;
  } catch (error: any) {
    emitApiError("Erreur lors de la récupération des options de paiement", error.status ?? 500);
    return null;
  }
}

export async function createPaymentOption({ token, logout }: FetchOptions, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.post(`paymentOption`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la création de l'option de paiement", error.status ?? 500);
        return false;
  }
}

export async function updatePaymentOption({ token, logout }: FetchOptions, id: number, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.put(`paymentOption/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la mise à jour de l'option de paiement", error.response?.status ?? 500);
        return false;
    }
}

export async function deletePaymentOption({ token, logout }: FetchOptions, id: number): Promise<boolean> {
    try {
        const response = await apiClient.delete(`paymentOption/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la suppression de l'option de paiement", error.response?.status ?? 500);
        return false;
    }
}

export async function fetchTagList({ token, logout }: FetchOptions): Promise<CategoryInfo[] | null> {
  try {
    const response = await apiClient.get(`tag`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      logout();
      return null;
    }
    return response.data as CategoryInfo[];;
  } catch (error: any) {
    emitApiError("Erreur lors de la récupération des tags", error.status ?? 500);
    return null;
  }
}

export async function createTag({ token, logout }: FetchOptions, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.post(`tag`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la création du tag", error.status ?? 500);
        return false;
  }
}

export async function updateTag({ token, logout }: FetchOptions, id: number, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.put(`tag/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la mise à jour du tag", error.response?.status ?? 500);
        return false;
    }
}

export async function deleteTag({ token, logout }: FetchOptions, id: number): Promise<boolean> {
    try {
        const response = await apiClient.delete(`tag/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la suppression du tag", error.response?.status ?? 500);
        return false;
    }
}

export async function fetchWearList({ token, logout }: FetchOptions): Promise<CategoryInfo[] | null> {
  try {
    const response = await apiClient.get(`wear`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      logout();
      return null;
    }
    return response.data as CategoryInfo[];;
  } catch (error: any) {
    emitApiError("Erreur lors de la récupération de l'état", error.status ?? 500);
    return null;
  }
}

export async function createWear({ token, logout }: FetchOptions, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.post(`wear`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la création de l'état", error.status ?? 500);
        return false;
  }
}

export async function updateWear({ token, logout }: FetchOptions, id: number, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.put(`wear/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la mise à jour de l'état", error.response?.status ?? 500);
        return false;
    }
}

export async function deleteWear({ token, logout }: FetchOptions, id: number): Promise<boolean> {
    try {
        const response = await apiClient.delete(`wear/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la suppression de l'état", error.response?.status ?? 500);
        return false;
    }
}

