import { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "../../../components/icons";
import Button from "../../../components/ui/Button";
import FieldLabel from "../../../components/ui/FieldLabel";
import Input from "../../../components/ui/Input";
import Pagination from "../../../components/ui/Pagination";
import Toggle from "../../../components/ui/Toggle";
import { useToast } from "../../../store/toast-store";
import {
  createProvince,
  createWard,
  createWardAddress,
  deleteProvince,
  deleteWardAddress,
  deleteWard,
  listProvinces,
  listWardAddresses,
  listWards,
  updateProvince,
  updateWardAddress,
  updateWard,
  type AdministrativeStatus,
  type ProvinceItem,
  type WardAddressItem,
  type WardItem,
} from "../services/administrative-units-api";

type ModalMode = "province" | "ward" | "address";
type EditingRecord = ProvinceItem | WardItem | WardAddressItem | null;

type ModalState = {
  mode: ModalMode;
  record: EditingRecord;
} | null;

const PAGE_SIZE = 10;

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function matchesSearch(values: string[], query: string): boolean {
  const q = normalizeText(query.trim());
  if (!q) return true;
  return values.some((value) => normalizeText(value).includes(q));
}

function getTableRowClass(index: number, active = false): string {
  if (active) {
    return [
      "relative z-[1] bg-white",
      "[&>td]:border-y-[1px] [&>td]:border-secondary",
      "[&>td:first-child]:border-l-[1px] [&>td:first-child]:rounded-l-[8px]",
      "[&>td:last-child]:border-r-[1px] [&>td:last-child]:rounded-r-[8px]",
    ].join(" ");
  }

  return index % 2 === 1 ? "bg-main-light/40" : "";
}

function getTotalPages(totalItems: number): number {
  return Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
}

function getSafePage(page: number, totalItems: number): number {
  return Math.min(page, getTotalPages(totalItems));
}

function paginateItems<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

export default function AdministrativeUnitsDashboard() {
  const { showToast } = useToast();
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [wards, setWards] = useState<WardItem[]>([]);
  const [addresses, setAddresses] = useState<WardAddressItem[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");
  const [provinceSearch, setProvinceSearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [provincePage, setProvincePage] = useState(1);
  const [wardPage, setWardPage] = useState(1);
  const [addressPage, setAddressPage] = useState(1);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  const selectedProvince = provinces.find(
    (item) => item.id === selectedProvinceId,
  );
  const selectedWard = wards.find((item) => item.id === selectedWardId);

  const handleSelectProvince = (provinceId: string) => {
    setSelectedProvinceId(provinceId);
    setWardPage(1);
    setAddressPage(1);
  };

  const handleSelectWard = (wardId: string) => {
    setSelectedWardId(wardId);
    setAddressPage(1);
  };

  const reloadProvinces = useCallback(async () => {
    setLoadingProvinces(true);
    try {
      const data = await listProvinces();
      setProvinces(data);
      setSelectedProvinceId((current) => current || data[0]?.id || "");
    } catch {
      setProvinces([]);
      showToast(
        "Không thể tải tỉnh/thành phố",
        "Vui lòng kiểm tra kết nối tới hệ thống.",
      );
    } finally {
      setLoadingProvinces(false);
    }
  }, [showToast]);

  const reloadWards = useCallback(async () => {
    if (!selectedProvinceId) {
      setWards([]);
      setSelectedWardId("");
      return;
    }
    setLoadingWards(true);
    try {
      const data = await listWards(selectedProvinceId);
      setWards(data);
      setSelectedWardId((current) =>
        data.some((item) => item.id === current) ? current : data[0]?.id || "",
      );
    } catch {
      setWards([]);
      setSelectedWardId("");
      showToast("Không thể tải phường", "Vui lòng thử lại sau.");
    } finally {
      setLoadingWards(false);
    }
  }, [selectedProvinceId, showToast]);

  const reloadAddresses = useCallback(async () => {
    if (!selectedWardId) {
      setAddresses([]);
      return;
    }
    setLoadingAddresses(true);
    try {
      setAddresses(await listWardAddresses(selectedWardId));
    } catch {
      setAddresses([]);
      showToast("Không thể tải địa chỉ", "Vui lòng thử lại sau.");
    } finally {
      setLoadingAddresses(false);
    }
  }, [selectedWardId, showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reloadProvinces();
  }, [reloadProvinces]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedWardId("");
    setAddresses([]);
    void reloadWards();
  }, [reloadWards]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reloadAddresses();
  }, [reloadAddresses]);

  const filteredProvinces = useMemo(
    () =>
      provinces.filter((item) =>
        matchesSearch([item.code, item.name], provinceSearch),
      ),
    [provinceSearch, provinces],
  );
  const filteredWards = useMemo(
    () =>
      wards.filter((item) => matchesSearch([item.code, item.name], wardSearch)),
    [wardSearch, wards],
  );
  const filteredAddresses = useMemo(
    () =>
      addresses.filter((item) =>
        matchesSearch(
          [item.wardCode, item.address, item.description],
          addressSearch,
        ),
      ),
    [addressSearch, addresses],
  );

  const safeProvincePage = getSafePage(provincePage, filteredProvinces.length);
  const safeWardPage = getSafePage(wardPage, filteredWards.length);
  const safeAddressPage = getSafePage(addressPage, filteredAddresses.length);
  const pagedProvinces = paginateItems(filteredProvinces, safeProvincePage);
  const pagedWards = paginateItems(filteredWards, safeWardPage);
  const pagedAddresses = paginateItems(filteredAddresses, safeAddressPage);

  const closeModal = () => setModal(null);

  const handleDeleteProvince = async (item: ProvinceItem) => {
    if (!window.confirm(`Xoá tỉnh/thành phố "${item.name}"?`)) return;
    await deleteProvince(item.id);
    showToast("Đã xoá tỉnh/thành phố", item.name);
    if (item.id === selectedProvinceId) {
      setSelectedProvinceId("");
      setSelectedWardId("");
      setWardPage(1);
      setAddressPage(1);
    }
    void reloadProvinces();
  };

  const handleDeleteWard = async (item: WardItem) => {
    if (!window.confirm(`Xoá phường "${item.name}"?`)) return;
    await deleteWard(item.id);
    showToast("Đã xoá phường", item.name);
    if (item.id === selectedWardId) {
      setSelectedWardId("");
      setAddressPage(1);
    }
    void reloadWards();
  };

  const handleDeleteAddress = async (item: WardAddressItem) => {
    if (!window.confirm(`Xoá địa chỉ "${item.address}"?`)) return;
    await deleteWardAddress(item.id);
    showToast("Đã xoá địa chỉ", item.address);
    void reloadAddresses();
  };

  return (
    <section className="flex flex-col gap-4">
      <ManagementTable
        title="Tỉnh / Thành phố"
        description="Danh sách tỉnh, thành phố đang quản lý"
        icon="location"
        addText="Thêm Tỉnh"
        searchValue={provinceSearch}
        onSearchChange={(value) => {
          setProvinceSearch(value);
          setProvincePage(1);
        }}
        onAdd={() => setModal({ mode: "province", record: null })}
        pagination={
          <TablePagination
            totalItems={filteredProvinces.length}
            page={safeProvincePage}
            onPageChange={setProvincePage}
          />
        }
      >
        <table className="w-full border-separate border-spacing-y-0">
          <thead>
            <tr className="bg-secondary-light text-para-m-semibold text-text-main">
              <Th>STT</Th>
              <Th>Mã tỉnh/thành phố</Th>
              <Th>Tên Tỉnh/Thành phố</Th>
              <Th>Trạng thái</Th>
              <Th> </Th>
            </tr>
          </thead>
          <tbody>
            {renderRows({
              loading: loadingProvinces,
              emptyText: "Chưa có tỉnh/thành phố nào.",
              colSpan: 5,
              rows: pagedProvinces.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => handleSelectProvince(item.id)}
                  className={`cursor-pointer border-divider transition-colors hover:bg-secondary-light/45 ${getTableRowClass(
                    index,
                    selectedProvinceId === item.id,
                  )}`}
                >
                  <Td>{(safeProvincePage - 1) * PAGE_SIZE + index + 1}</Td>
                  <Td className="text-para-m-semibold text-text-main">
                    {item.code || "-"}
                  </Td>
                  <Td>{item.name || "-"}</Td>
                  <Td>
                    <StatusPill status={item.status} />
                  </Td>
                  <Td>
                    <RowActions
                      onEdit={() =>
                        setModal({ mode: "province", record: item })
                      }
                      onDelete={() => void handleDeleteProvince(item)}
                    />
                  </Td>
                </tr>
              )),
            })}
          </tbody>
        </table>
      </ManagementTable>

      <ManagementTable
        title="Phường"
        description={
          selectedProvince
            ? `Lọc theo: ${selectedProvince.name}`
            : "Chọn tỉnh/thành phố để xem phường"
        }
        icon="document"
        addText="Thêm Phường"
        searchValue={wardSearch}
        onSearchChange={(value) => {
          setWardSearch(value);
          setWardPage(1);
        }}
        onAdd={() => setModal({ mode: "ward", record: null })}
        addDisabled={!selectedProvinceId}
        pagination={
          selectedProvinceId ? (
            <TablePagination
              totalItems={filteredWards.length}
              page={safeWardPage}
              onPageChange={setWardPage}
            />
          ) : null
        }
      >
        <table className="w-full border-separate border-spacing-y-0">
          <thead>
            <tr className="bg-secondary-light text-para-m-semibold text-text-main">
              <Th>STT</Th>
              <Th>Mã phường</Th>
              <Th>Tên phường</Th>
              <Th>Trạng thái</Th>
              <Th> </Th>
            </tr>
          </thead>
          <tbody>
            {selectedProvinceId
              ? renderRows({
                  loading: loadingWards,
                  emptyText: "Chưa có phường nào trong tỉnh/thành phố này.",
                  colSpan: 5,
                  rows: pagedWards.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectWard(item.id)}
                      className={`cursor-pointer border-divider transition-colors hover:bg-secondary-light/45 ${getTableRowClass(
                        index,
                        selectedWardId === item.id,
                      )}`}
                    >
                      <Td>{(safeWardPage - 1) * PAGE_SIZE + index + 1}</Td>
                      <Td className="text-para-m-semibold text-text-main">
                        {item.code || "-"}
                      </Td>
                      <Td>{item.name || "-"}</Td>
                      <Td>
                        <StatusPill status={item.status} />
                      </Td>
                      <Td>
                        <RowActions
                          onEdit={() =>
                            setModal({ mode: "ward", record: item })
                          }
                          onDelete={() => void handleDeleteWard(item)}
                        />
                      </Td>
                    </tr>
                  )),
                })
              : renderEmpty("Chọn tỉnh/thành phố để thấy danh sách phường", 5)}
          </tbody>
        </table>
      </ManagementTable>

      <ManagementTable
        title="Địa chỉ tại phường"
        description={
          selectedWard
            ? `Lọc theo: ${selectedWard.name}`
            : "Chọn phường để xem danh sách địa chỉ"
        }
        icon="location"
        addText="Thêm Địa Chỉ"
        searchValue={addressSearch}
        onSearchChange={(value) => {
          setAddressSearch(value);
          setAddressPage(1);
        }}
        onAdd={() => setModal({ mode: "address", record: null })}
        addDisabled={!selectedWardId}
        pagination={
          selectedWardId ? (
            <TablePagination
              totalItems={filteredAddresses.length}
              page={safeAddressPage}
              onPageChange={setAddressPage}
            />
          ) : null
        }
      >
        <table className="w-full border-separate border-spacing-y-0">
          <thead>
            <tr className="bg-secondary-light text-para-m-semibold text-text-main">
              <Th>STT</Th>
              <Th>Mã phường</Th>
              <Th>Địa chỉ</Th>
              <Th>Mô tả</Th>
              <Th>Trạng thái</Th>
              <Th> </Th>
            </tr>
          </thead>
          <tbody>
            {selectedWardId
              ? renderRows({
                  loading: loadingAddresses,
                  emptyText: "Chưa có địa chỉ nào trong phường này.",
                  colSpan: 6,
                  rows: pagedAddresses.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className={`border-divider ${getTableRowClass(index)}`}
                    >
                      <Td>{(safeAddressPage - 1) * PAGE_SIZE + index + 1}</Td>
                      <Td className="text-para-m-semibold text-text-main">
                        {item.wardCode || selectedWard?.code || "-"}
                      </Td>
                      <Td>{item.address || "-"}</Td>
                      <Td>{item.description || "-"}</Td>
                      <Td>
                        <StatusPill status={item.status} />
                      </Td>
                      <Td>
                        <RowActions
                          onEdit={() =>
                            setModal({ mode: "address", record: item })
                          }
                          onDelete={() => void handleDeleteAddress(item)}
                        />
                      </Td>
                    </tr>
                  )),
                })
              : renderEmpty("Chọn phường để thấy danh sách địa chỉ", 6)}
          </tbody>
        </table>
      </ManagementTable>

      {modal && (
        <AdministrativeUnitModal
          state={modal}
          selectedProvinceId={selectedProvinceId}
          selectedWardId={selectedWardId}
          onClose={closeModal}
          onSaved={() => {
            closeModal();
            void reloadProvinces();
            void reloadWards();
            void reloadAddresses();
          }}
        />
      )}
    </section>
  );
}

function ManagementTable({
  title,
  description,
  icon,
  addText,
  searchValue,
  onSearchChange,
  onAdd,
  addDisabled = false,
  pagination = null,
  children,
}: {
  title: string;
  description: string;
  icon: "document" | "location";
  addText: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  addDisabled?: boolean;
  pagination?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-input-border bg-white p-2 shadow-[0_0_8px_rgba(182,192,187,0.22)]">
      <div className="flex items-center justify-between gap-4">
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
            placeholder="Tìm kiếm theo tên hoặc mã"
            icon="search"
            onChange={(event) => onSearchChange(event.target.value)}
            boxClassName="!py-3"
          />
          <Button
            size="12px"
            text={addText}
            showIcon
            icon="plus"
            disabled={addDisabled}
            onClick={onAdd}
            className="shrink-0"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-input-border">
        {children}
      </div>
      {pagination}
    </div>
  );
}

function TablePagination({
  totalItems,
  page,
  onPageChange,
}: {
  totalItems: number;
  page: number;
  onPageChange: (page: number) => void;
}) {
  if (totalItems <= PAGE_SIZE) return null;
  return (
    <Pagination
      currentPage={page}
      totalPages={getTotalPages(totalItems)}
      onPageChange={onPageChange}
      className="justify-end"
    />
  );
}

function renderRows({
  loading,
  emptyText,
  colSpan,
  rows,
}: {
  loading: boolean;
  emptyText: string;
  colSpan: number;
  rows: React.ReactNode[];
}) {
  if (loading) {
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
  if (rows.length === 0) return renderEmpty(emptyText, colSpan);
  return rows;
}

function renderEmpty(text: string, colSpan: number) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-14 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-text-placeholder">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-grey">
            <Icon name="location" size={20} className="text-text-placeholder" />
          </span>
          <span className="text-para-m-regular">{text}</span>
        </div>
      </td>
    </tr>
  );
}

function StatusPill({ status }: { status: AdministrativeStatus }) {
  const active = status === "active";
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
    <div
      className="flex items-center justify-center gap-3"
      onClick={(event) => event.stopPropagation()}
    >
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

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-3 text-center">{children}</th>;
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

function AdministrativeUnitModal({
  state,
  selectedProvinceId,
  selectedWardId,
  onClose,
  onSaved,
}: {
  state: Exclude<ModalState, null>;
  selectedProvinceId: string;
  selectedWardId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { showToast } = useToast();
  const record = state.record;
  const [code, setCode] = useState(
    "code" in (record ?? {})
      ? String((record as ProvinceItem | WardItem).code)
      : "",
  );
  const [name, setName] = useState(
    "name" in (record ?? {})
      ? String((record as ProvinceItem | WardItem).name)
      : "",
  );
  const [address, setAddress] = useState(
    "address" in (record ?? {})
      ? String((record as WardAddressItem).address)
      : "",
  );
  const [description, setDescription] = useState(
    "description" in (record ?? {})
      ? String((record as WardAddressItem).description)
      : "",
  );
  const [isActive, setIsActive] = useState(
    "status" in (record ?? {})
      ? (record as { status: AdministrativeStatus }).status === "active"
      : true,
  );
  const [saving, setSaving] = useState(false);

  const title =
    state.mode === "province"
      ? record
        ? "Sửa Tỉnh/Thành phố"
        : "Thêm Tỉnh/Thành phố"
      : state.mode === "ward"
        ? record
          ? "Sửa Phường"
          : "Thêm Phường"
        : "Thêm Địa Chỉ";
  const titleUpper = title.toUpperCase();
  const modalNote =
    state.mode === "address"
      ? "Lưu ý: Các giá trị của ô Kết quả trả về sẽ được trả về cho người dân."
      : "Lưu ý: Thông tin đơn vị hành chính sẽ được dùng để lọc và quản lý hồ sơ.";

  const handleSave = async () => {
    setSaving(true);
    try {
      if (state.mode === "province") {
        const payload = {
          slug: code,
          name,
          is_active: isActive,
        };
        if (record) await updateProvince((record as ProvinceItem).id, payload);
        else await createProvince(payload);
      } else if (state.mode === "ward") {
        const payload = {
          slug: code,
          name,
          province_id: selectedProvinceId,
          is_active: isActive,
        };
        if (record) await updateWard((record as WardItem).id, payload);
        else await createWard(payload);
      } else {
        const payload = {
          org_id: selectedWardId,
          dia_chi: address,
          is_active: isActive,
        };
        if (record)
          await updateWardAddress((record as WardAddressItem).id, payload);
        else await createWardAddress(payload);
      }
      showToast("Đã lưu thay đổi", title);
      onSaved();
    } catch {
      showToast(
        "Không thể lưu thay đổi",
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
        className="flex w-full max-w-[44rem] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6 bg-main px-6 pt-6 py-4 text-white">
          <div className="flex flex-col gap-2">
            <h3 className="text-h3 font-bold uppercase leading-none">
              {titleUpper}
            </h3>
            <p className="text-para-m-regular leading-relaxed text-white/90">
              {modalNote}
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

        <div className="flex flex-col gap-4 px-6 py-6">
          {state.mode !== "address" ? (
            <>
              <div className="flex flex-col gap-2">
                <FieldLabel required>
                  {state.mode === "province"
                    ? "Mã tỉnh/thành phố"
                    : "Mã phường"}
                </FieldLabel>
                <Input
                  value={code}
                  placeholder={
                    state.mode === "province"
                      ? "Nhập mã tỉnh/thành phố mới tại đây"
                      : "Nhập mã phường mới tại đây"
                  }
                  onChange={(event) => setCode(event.target.value)}
                  boxClassName="!py-4 !px-6 !rounded-xl !gap-4"
                  className="!text-para-m-regular placeholder:!text-para-m-regular"
                />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel required>
                  {state.mode === "province" ? "Tỉnh/Thành phố" : "Phường"}
                </FieldLabel>
                <Input
                  value={name}
                  placeholder={
                    state.mode === "province"
                      ? "Nhập tên tỉnh/thành phố mới tại đây"
                      : "Nhập tên phường mới tại đây"
                  }
                  onChange={(event) => setName(event.target.value)}
                  boxClassName="!py-4 !px-6 !rounded-xl !gap-4"
                  className="!text-para-m-regular placeholder:!text-para-m-regular"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <FieldLabel required>Địa chỉ</FieldLabel>
                <Input
                  value={address}
                  placeholder="Nhập địa chỉ phường mới tại đây"
                  onChange={(event) => setAddress(event.target.value)}
                  boxClassName="!py-4 !px-6 !rounded-xl !gap-4"
                  className="!text-para-m-regular placeholder:!text-para-m-regular"
                />
              </div>
              <div className="flex flex-col gap-2">
                <FieldLabel required>Mô tả</FieldLabel>
                <Input
                  value={description}
                  placeholder="Nhập mô tả địa chỉ tại đây"
                  multiline
                  onChange={(event) => setDescription(event.target.value)}
                  boxClassName="!py-4 !px-6 !rounded-xl !gap-4"
                  className="!text-para-m-regular placeholder:!text-para-m-regular"
                />
              </div>
            </>
          )}
          <div className="flex items-center justify-between rounded-xl border border-input-border px-6 py-4">
            <div className="flex flex-col gap-1">
              <FieldLabel required>Trạng thái</FieldLabel>
              <span className="text-para-m-regular text-text-placeholder">
                {isActive ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </div>
            <Toggle checked={isActive} onChange={setIsActive} />
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
