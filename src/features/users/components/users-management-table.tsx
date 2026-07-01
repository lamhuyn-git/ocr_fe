import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "../../../components/icons";
import Button from "../../../components/ui/Button";
import FieldLabel from "../../../components/ui/FieldLabel";
import Input from "../../../components/ui/Input";
import Pagination from "../../../components/ui/Pagination";
import Select from "../../../components/ui/Select";
import { useToast } from "../../../store/toast-store";
import type { SelectOption } from "../../residence-form/types";
import {
  createCitizen,
  createEmptyCitizen,
  deleteCitizen,
  listCitizens,
  listUserAccounts,
  updateCitizen,
  type CitizenItem,
  type CitizenPayload,
  type UserAccountItem,
} from "../services/users-api";

const PAGE_SIZE = 20;

const GENDER_OPTIONS: SelectOption[] = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
  { label: "Khác", value: "Khác" },
];

const RESIDENCE_STATUS_OPTIONS: SelectOption[] = [
  { label: "Thường trú", value: "thuong_tru" },
  { label: "Tạm trú", value: "tam_tru" },
  { label: "Khác", value: "khac" },
];

const LIFE_STATUS_OPTIONS: SelectOption[] = [
  { label: "Còn sống", value: "alive" },
  { label: "Đã mất", value: "dead" },
];

const CITIZEN_FIELD_GROUPS: Array<{
  title: string;
  fields: Array<{
    key: keyof CitizenPayload;
    label: string;
    type?: "date" | "select";
    options?: SelectOption[];
    required?: boolean;
  }>;
}> = [
  {
    title: "Thông tin định danh",
    fields: [
      { key: "ho_chu_dem_va_ten", label: "Họ, chữ đệm và tên", required: true },
      { key: "ten_goi_khac", label: "Tên gọi khác" },
      { key: "ngay_sinh", label: "Ngày sinh", type: "date", required: true },
      {
        key: "gioi_tinh",
        label: "Giới tính",
        type: "select",
        options: GENDER_OPTIONS,
      },
      { key: "so_dinh_danh", label: "Số định danh", required: true },
      { key: "so_dien_thoai", label: "Số điện thoại" },
      { key: "email", label: "Email" },
    ],
  },
  {
    title: "Thông tin cá nhân",
    fields: [
      { key: "noi_sinh", label: "Nơi sinh" },
      { key: "noi_dang_ky_khai_sinh", label: "Nơi đăng ký khai sinh" },
      { key: "que_quan", label: "Quê quán" },
      { key: "dan_toc", label: "Dân tộc" },
      { key: "ton_giao", label: "Tôn giáo" },
      { key: "quoc_tich", label: "Quốc tịch" },
      { key: "nhom_mau", label: "Nhóm máu" },
      { key: "tinh_trang_hon_nhan", label: "Tình trạng hôn nhân" },
      { key: "nghe_nghiep", label: "Nghề nghiệp" },
    ],
  },
  {
    title: "Cư trú và hộ gia đình",
    fields: [
      { key: "noi_thuong_tru", label: "Nơi thường trú" },
      { key: "noi_tam_tru", label: "Nơi tạm trú" },
      { key: "noi_o_hien_tai", label: "Nơi ở hiện tại" },
      {
        key: "tinh_trang_cu_tru",
        label: "Tình trạng cư trú",
        type: "select",
        options: RESIDENCE_STATUS_OPTIONS,
      },
      { key: "ma_ho", label: "Mã hộ" },
      { key: "quan_he_voi_chu_ho", label: "Quan hệ với chủ hộ" },
      { key: "so_dinh_danh_chu_ho", label: "Số định danh chủ hộ" },
    ],
  },
  {
    title: "Tình trạng",
    fields: [
      {
        key: "tinh_trang_song",
        label: "Tình trạng sống",
        type: "select",
        options: LIFE_STATUS_OPTIONS,
      },
      { key: "ngay_mat", label: "Ngày mất", type: "date" },
    ],
  },
];

const CITIZEN_COLUMNS: Array<{
  key: keyof CitizenItem;
  label: string;
  wide?: boolean;
}> = [
  { key: "ho_chu_dem_va_ten", label: "Họ và tên", wide: true },
  { key: "so_dinh_danh", label: "Số định danh" },
  { key: "ngay_sinh", label: "Ngày sinh" },
  { key: "gioi_tinh", label: "Giới tính" },
  { key: "so_dien_thoai", label: "Số điện thoại" },
  { key: "email", label: "Email", wide: true },
  { key: "ten_goi_khac", label: "Tên gọi khác" },
  { key: "noi_sinh", label: "Nơi sinh", wide: true },
  { key: "noi_dang_ky_khai_sinh", label: "Nơi ĐK khai sinh", wide: true },
  { key: "que_quan", label: "Quê quán", wide: true },
  { key: "dan_toc", label: "Dân tộc" },
  { key: "ton_giao", label: "Tôn giáo" },
  { key: "quoc_tich", label: "Quốc tịch" },
  { key: "nhom_mau", label: "Nhóm máu" },
  { key: "noi_thuong_tru", label: "Nơi thường trú", wide: true },
  { key: "noi_tam_tru", label: "Nơi tạm trú", wide: true },
  { key: "noi_o_hien_tai", label: "Nơi ở hiện tại", wide: true },
  { key: "tinh_trang_cu_tru", label: "Tình trạng cư trú" },
  { key: "ma_ho", label: "Mã hộ" },
  { key: "quan_he_voi_chu_ho", label: "Quan hệ chủ hộ" },
  { key: "so_dinh_danh_chu_ho", label: "Định danh chủ hộ" },
  { key: "tinh_trang_hon_nhan", label: "Hôn nhân" },
  { key: "nghe_nghiep", label: "Nghề nghiệp" },
  { key: "tinh_trang_song", label: "Tình trạng sống" },
  { key: "ngay_mat", label: "Ngày mất" },
];

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function getTotalPages(totalItems: number): number {
  return Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
}

function getSafePage(page: number, totalItems: number): number {
  return Math.min(page, getTotalPages(totalItems));
}

function formatCitizenValue(key: keyof CitizenItem, value: string): string {
  if (!value) return "-";
  if (key === "tinh_trang_cu_tru") {
    return (
      RESIDENCE_STATUS_OPTIONS.find((option) => option.value === value)
        ?.label || value
    );
  }
  if (key === "tinh_trang_song") {
    return (
      LIFE_STATUS_OPTIONS.find((option) => option.value === value)?.label ||
      value
    );
  }
  return value;
}

function formatDateTime(value: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatUserRole(role: string): string {
  const roleLabels: Record<string, string> = {
    user: "Người dùng",
    admin: "Quản trị viên",
    ward_admin: "Cán bộ phường",
  };
  return roleLabels[role] || role || "-";
}

export default function UsersManagementTable() {
  return (
    <section className="flex flex-col gap-4">
      <CitizensTable />
      <UserAccountsTable />
    </section>
  );
}

function UserAccountsTable() {
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState<UserAccountItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const reloadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      setAccounts(await listUserAccounts());
    } catch {
      setAccounts([]);
      showToast(
        "Không thể tải bảng tài khoản người dùng",
        "Vui lòng thử lại sau.",
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void Promise.resolve().then(reloadAccounts);
  }, [reloadAccounts]);

  const filteredAccounts = useMemo(() => {
    const q = normalizeText(query.trim());
    if (!q) return accounts;
    return accounts.filter((account) =>
      [
        account.national_id,
        account.email,
        account.full_name,
        account.role,
        formatUserRole(account.role),
        account.ward?.ward_name ?? "",
        account.ward?.province_name ?? "",
      ].some((value) => normalizeText(value).includes(q)),
    );
  }, [accounts, query]);

  const safePage = getSafePage(page, filteredAccounts.length);
  const pagedAccounts = filteredAccounts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <ManagementTable
      title="Bảng tài khoản người dùng"
      description="Danh sách tài khoản hệ thống theo API /api/v1/users"
      icon="group"
      searchValue={query}
      searchPlaceholder="Tìm theo tên, định danh, email, vai trò, phường"
      onSearchChange={(value) => {
        setQuery(value);
        setPage(1);
      }}
      pagination={
        !loading && filteredAccounts.length > PAGE_SIZE ? (
          <Pagination
            currentPage={safePage}
            totalPages={getTotalPages(filteredAccounts.length)}
            onPageChange={setPage}
            className="justify-end"
          />
        ) : null
      }
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed border-separate border-spacing-y-0">
          <thead>
            <tr className="bg-secondary-light text-para-m-semibold text-text-main">
              <Th className="w-[4rem]">STT</Th>
              <Th className="w-[10rem]">Số CCCD</Th>
              <Th className="w-[14rem]">Họ tên</Th>
              <Th className="w-[16rem]">Email</Th>
              <Th className="w-[10rem]">Vai trò</Th>
              <Th className="w-[13rem]">Phường</Th>
              <Th className="w-[13rem]">Tỉnh/Thành phố</Th>
              <Th className="w-[8rem]">Hoạt động</Th>
              <Th className="w-[10rem]">Ngày tạo</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRow colSpan={9} />
            ) : pagedAccounts.length === 0 ? (
              <EmptyRow colSpan={9} text="Chưa có tài khoản người dùng nào." />
            ) : (
              pagedAccounts.map((account, index) => (
                <tr
                  key={account.id || `${account.national_id}-${index}`}
                  className={`border-divider ${
                    index % 2 === 1 ? "bg-main-light/40" : "bg-white"
                  }`}
                >
                  <Td className="text-text-placeholder">
                    {(safePage - 1) * PAGE_SIZE + index + 1}
                  </Td>
                  <Td className="text-para-m-semibold text-text-main">
                    {account.national_id || "-"}
                  </Td>
                  <Td>{account.full_name || "-"}</Td>
                  <Td>{account.email || "-"}</Td>
                  <Td>{formatUserRole(account.role)}</Td>
                  <Td>{account.ward?.ward_name || "-"}</Td>
                  <Td>{account.ward?.province_name || "-"}</Td>
                  <Td>
                    <StatusPill active={account.is_active} />
                  </Td>
                  <Td>{formatDateTime(account.created_at)}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ManagementTable>
  );
}

function CitizensTable() {
  const { showToast } = useToast();
  const [citizens, setCitizens] = useState<CitizenItem[]>([]);
  const [totalCitizens, setTotalCitizens] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingCitizen, setEditingCitizen] = useState<
    CitizenItem | null | undefined
  >();

  const reloadCitizens = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listCitizens({ page, pageSize: PAGE_SIZE });
      setCitizens(data.items);
      setTotalCitizens(data.total);
    } catch {
      setCitizens([]);
      setTotalCitizens(0);
      showToast("Không thể tải danh sách người dân", "Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [page, showToast]);

  useEffect(() => {
    void Promise.resolve().then(reloadCitizens);
  }, [reloadCitizens]);

  const filteredCitizens = useMemo(() => {
    const q = normalizeText(query.trim());
    if (!q) return citizens;
    return citizens.filter((citizen) =>
      [
        citizen.ho_chu_dem_va_ten,
        citizen.ten_goi_khac,
        citizen.so_dinh_danh,
        citizen.so_dien_thoai,
        citizen.email,
        citizen.ma_ho,
      ].some((value) => normalizeText(value).includes(q)),
    );
  }, [citizens, query]);

  const totalPages = getTotalPages(totalCitizens);

  const handleDelete = async (citizen: CitizenItem) => {
    const name = citizen.ho_chu_dem_va_ten || citizen.so_dinh_danh;
    if (!window.confirm(`Xoá người dân "${name}"?`)) return;
    try {
      await deleteCitizen(citizen.id);
      showToast("Đã xoá người dân", name);
      void reloadCitizens();
    } catch {
      showToast("Không thể xoá người dân", "Vui lòng thử lại sau.");
    }
  };

  return (
    <ManagementTable
      title="Danh sách người dân"
      description="Quản lý thông tin định danh, cư trú và liên hệ của người dân"
      icon="document"
      searchValue={query}
      searchPlaceholder="Tìm theo tên, số định danh, SĐT, email"
      onSearchChange={(value) => {
        setQuery(value);
        setPage(1);
      }}
      action={
        <Button
          size="12px"
          text="Thêm người dân"
          showIcon
          icon="plus"
          onClick={() => setEditingCitizen(null)}
          className="shrink-0"
        />
      }
      pagination={
        !loading && totalCitizens > PAGE_SIZE ? (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="justify-end"
          />
        ) : null
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-[180rem] border-separate border-spacing-y-0">
          <thead>
            <tr className="bg-secondary-light text-para-m-semibold text-text-main">
              <Th className="sticky left-0 z-10 bg-secondary-light">STT</Th>
              {CITIZEN_COLUMNS.map((column) => (
                <Th
                  key={column.key}
                  className={column.wide ? "min-w-[14rem]" : "min-w-[9rem]"}
                >
                  {column.label}
                </Th>
              ))}
              <Th className="sticky right-0 z-10 bg-secondary-light"> </Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingRow colSpan={CITIZEN_COLUMNS.length + 2} />
            ) : filteredCitizens.length === 0 ? (
              <EmptyRow
                colSpan={CITIZEN_COLUMNS.length + 2}
                text="Chưa có người dân nào."
              />
            ) : (
              filteredCitizens.map((citizen, index) => (
                <tr
                  key={citizen.id || `${citizen.so_dinh_danh}-${index}`}
                  className={`border-divider ${
                    index % 2 === 1 ? "bg-main-light/40" : "bg-white"
                  }`}
                >
                  <Td className="sticky left-0 z-[1] bg-inherit text-text-placeholder">
                    {(page - 1) * PAGE_SIZE + index + 1}
                  </Td>
                  {CITIZEN_COLUMNS.map((column) => (
                    <Td key={column.key}>
                      <span className="line-clamp-2">
                        {formatCitizenValue(
                          column.key,
                          String(citizen[column.key] ?? ""),
                        )}
                      </span>
                    </Td>
                  ))}
                  <Td className="sticky right-0 z-[1] bg-inherit">
                    <RowActions
                      onEdit={() => setEditingCitizen(citizen)}
                      onDelete={() => void handleDelete(citizen)}
                    />
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingCitizen !== undefined && (
        <CitizenModal
          citizen={editingCitizen}
          onClose={() => setEditingCitizen(undefined)}
          onSaved={() => {
            setEditingCitizen(undefined);
            void reloadCitizens();
          }}
        />
      )}
    </ManagementTable>
  );
}

function ManagementTable({
  title,
  description,
  icon,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  action,
  pagination,
  children,
}: {
  title: string;
  description: string;
  icon: "document" | "group";
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  action?: React.ReactNode;
  pagination?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-input-border bg-white p-2 shadow-[0_0_8px_rgba(182,192,187,0.22)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-light text-secondary">
            <Icon name={icon} size={20} className="text-secondary" />
          </span>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-para-m-semibold text-text-main">{title}</h3>
            <p className="text-para-m-regular text-text-placeholder">
              {description}
            </p>
          </div>
        </div>
        <div className="flex min-w-[25rem] items-center gap-2">
          <Input
            value={searchValue}
            placeholder={searchPlaceholder}
            icon="search"
            onChange={(event) => onSearchChange(event.target.value)}
            boxClassName="!py-3"
          />
          {action}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-input-border">
        {children}
      </div>
      {pagination}
    </div>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-para-m-semibold ${
        active
          ? "bg-secondary-light text-secondary"
          : "bg-grey-hover text-text-placeholder"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onEdit}
        className="text-text-placeholder hover:text-text-main"
      >
        <Icon name="edit" size={16} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="text-red hover:opacity-80"
      >
        <Icon name="delete" size={14} />
      </button>
    </div>
  );
}

function LoadingRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="py-10 text-center text-para-m-regular text-text-placeholder"
      >
        Đang tải dữ liệu...
      </td>
    </tr>
  );
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-14 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-text-placeholder">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-grey">
            <Icon name="group" size={20} />
          </span>
          <span className="text-para-m-regular">{text}</span>
        </div>
      </td>
    </tr>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-3 py-3 text-center ${className ?? ""}`}>{children}</th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`px-3 py-4 text-center align-middle text-para-m-regular text-text-secondary ${className ?? ""}`}
    >
      {children}
    </td>
  );
}

function CitizenModal({
  citizen,
  onClose,
  onSaved,
}: {
  citizen: CitizenItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState<CitizenPayload>(
    citizen ? { ...citizen } : createEmptyCitizen(),
  );
  const [saving, setSaving] = useState(false);

  const setField = (key: keyof CitizenPayload, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.ho_chu_dem_va_ten.trim() || !form.so_dinh_danh.trim()) {
      showToast(
        "Thiếu thông tin bắt buộc",
        "Vui lòng nhập họ tên và số định danh.",
      );
      return;
    }
    setSaving(true);
    try {
      if (citizen) await updateCitizen(citizen.id, form);
      else await createCitizen(form);
      showToast("Đã lưu người dân", form.ho_chu_dem_va_ten);
      onSaved();
    } catch {
      showToast(
        "Không thể lưu người dân",
        "Vui lòng kiểm tra dữ liệu và thử lại.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-[64rem] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6 bg-main px-6 py-5 text-white">
          <div className="flex flex-col gap-2">
            <h3 className="text-h3 font-bold uppercase leading-none">
              {citizen ? "SỬA NGƯỜI DÂN" : "THÊM NGƯỜI DÂN"}
            </h3>
            <p className="text-para-m-regular leading-relaxed text-white/90">
              Cập nhật thông tin định danh, cư trú và liên hệ của người dân.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-lg p-1 text-white transition-colors hover:bg-white/10"
          >
            <Icon name="cancel" size={20} className="[&_path]:stroke-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-6">
            {CITIZEN_FIELD_GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h4 className="text-para-m-semibold text-text-main">
                  {group.title}
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {group.fields.map((field) => (
                    <div key={field.key} className="flex flex-col gap-2">
                      <FieldLabel required={field.required}>
                        {field.label}
                      </FieldLabel>
                      {field.type === "select" ? (
                        <Select
                          value={String(form[field.key] ?? "")}
                          options={field.options ?? []}
                          placeholder={`Chọn ${field.label.toLowerCase()}`}
                          onChange={(value) => setField(field.key, value)}
                          triggerClassName="!py-3"
                        />
                      ) : (
                        <Input
                          value={String(form[field.key] ?? "")}
                          placeholder={`Nhập ${field.label.toLowerCase()}`}
                          rightIcon={
                            field.type === "date" ? "calendar" : undefined
                          }
                          onChange={(event) =>
                            setField(field.key, event.target.value)
                          }
                          boxClassName="!py-3"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-black-light-active px-6 py-5">
          <Button
            variant="secondary"
            size="14px"
            text="Thoát"
            onClick={onClose}
            disabled={saving}
            className="min-w-[8rem] !rounded-xl !border-input-border !px-6 !py-4 !text-para-m-regular !text-text-placeholder"
          />
          <Button
            size="14px"
            text={saving ? "Đang lưu..." : "Lưu"}
            onClick={handleSave}
            disabled={saving}
            className="min-w-[7rem] !rounded-xl !px-6 !py-4 !text-para-m-regular"
          />
        </div>
      </div>
    </div>
  );
}
