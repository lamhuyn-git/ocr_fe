export type SelectOption = { value: string; label: string };

// Thành viên hộ gia đình (1 dòng trong bảng)
export type HouseholdMember = {
  id: string;
  fullName: string;
  birthday: string;
  gender: string;
  idNumber: string;
  relationship: string;
};
