export class UserResponseDto {
  id: number;

  lastName: string;

  firstName: string;

  profilePicture?: string;

  deletedAt?: Date;

  constructor(
    id: number,
    lastName: string,
    firstName: string,
    profilePicture?: string,
    deletedAt?: Date,
  ) {
    this.id = id;
    this.lastName = lastName;
    this.firstName = firstName;
    this.profilePicture = profilePicture;
    this.deletedAt = deletedAt;
  }
}
