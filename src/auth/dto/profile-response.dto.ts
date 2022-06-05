export class ProfileResponseDto {
  id: number;
  email: string;
  lastName: string;
  firstName: string;
  profilePicture?: string;
  deletedAt?: Date;

  constructor(
    id: number,
    email: string,
    lastName: string,
    firstName: string,
    profilePicture?: string,
    deletedAt?: Date,
  ) {
    this.id = id;
    this.email = email;
    this.lastName = lastName;
    this.firstName = firstName;
    this.profilePicture = profilePicture;
    this.deletedAt = deletedAt;
  }
}
