export interface UserDTO {
  id: string;
  email: string;
  organizationId: string;
  createdAt: Date;
}

export interface OrganizationDTO {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}
