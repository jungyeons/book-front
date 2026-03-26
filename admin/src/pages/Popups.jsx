import { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPopups, createPopup, updatePopup, deletePopup } from "@/api/popups";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const DEVICE_OPTIONS = [
  { value: "all",    label: "전체" },
  { value: "pc",     label: "PC" },
  { value: "mobile", label: "모바일" },
];

const today     = () => new Date().toISOString().slice(0, 10);
const nextMonth = () => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d.toISOString().slice(0, 10); };

const EMPTY_FORM = {
  title: "", content: "", linkUrl: "",
  startDate: today(), endDate: nextMonth(),
  isActive: true, deviceType: "all",
};

/* ── 공통 select 스타일 ── */
const selectCls =
  "h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function PopupsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterActive,  setFilterActive]  = useState("");
  const [filterDevice,  setFilterDevice]  = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);

  const { data: popups = [], isLoading } = useQuery({
    queryKey: ["popups", filterKeyword, filterActive, filterDevice],
    queryFn: () => getPopups({
      keyword:    filterKeyword || undefined,
      active:     filterActive !== "" ? filterActive : undefined,
      deviceType: filterDevice || undefined,
    }),
  });

  const createMutation = useMutation({
    mutationFn: createPopup,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["popups"] }); toast({ title: "팝업이 등록되었습니다." }); closeForm(); },
    onError: (e) => toast({ title: e.message, variant: "destructive" }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePopup(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["popups"] }); toast({ title: "팝업이 수정되었습니다." }); closeForm(); },
    onError: (e) => toast({ title: e.message, variant: "destructive" }),
  });
  const deleteMutation = useMutation({
    mutationFn: deletePopup,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["popups"] }); toast({ title: "팝업이 삭제되었습니다." }); },
    onError: (e) => toast({ title: e.message, variant: "destructive" }),
  });

  const openCreate = () => { setEditId(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit   = (p)  => { setEditId(p.id); setForm({ title: p.title || "", content: p.content || "", linkUrl: p.linkUrl || "", startDate: p.startDate || today(), endDate: p.endDate || nextMonth(), isActive: p.isActive ?? true, deviceType: p.deviceType || "all" }); setShowForm(true); };
  const closeForm  = ()   => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast({ title: "제목을 입력해 주세요.", variant: "destructive" }); return; }
    editId ? updateMutation.mutate({ id: editId, data: form }) : createMutation.mutate(form);
  };
  const onDelete = (p) => {
    if (!window.confirm(`"${p.title}" 팝업을 삭제하시겠습니까?`)) return;
    deleteMutation.mutate(p.id);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-5">
      <PageHeader title="팝업 관리" description="홈페이지 메인화면에 띄울 팝업을 관리하세요." />

      {/* ── 필터 카드 ── */}
      <Card className="shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">검색어</Label>
              <Input
                placeholder="팝업 제목 검색"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">사용여부</Label>
              <select className={selectCls} value={filterActive} onChange={(e) => setFilterActive(e.target.value)}>
                <option value="">전체</option>
                <option value="true">사용</option>
                <option value="false">미사용</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Device</Label>
              <select className={selectCls} value={filterDevice} onChange={(e) => setFilterDevice(e.target.value)}>
                {DEVICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <Button onClick={openCreate} className="bg-[#2f355f] hover:bg-[#23284b] text-white h-10">
              <Plus className="mr-1.5 h-4 w-4" /> 새 팝업 등록
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── 목록 카드 ── */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-[#f8f7f4] text-[#5c4a32]">
                  {["순번","팝업제목","시작일","종료일","사용여부","Device","등록일","관리"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap text-xs tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">불러오는 중...</td></tr>
                ) : popups.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">등록된 팝업이 없습니다.</td></tr>
                ) : popups.map((popup, idx) => (
                  <tr key={popup.id} className="border-b last:border-0 hover:bg-[#faf9f7] transition-colors">
                    <td className="px-4 py-3 text-muted-foreground text-xs">{popups.length - idx}</td>
                    <td className="px-4 py-3 font-medium max-w-[180px]">
                      <span className="block truncate">{popup.title}</span>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{popup.startDate}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{popup.endDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        popup.isActive
                          ? "bg-[#2f355f] text-white"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {popup.isActive ? "사용" : "미사용"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
                        {popup.deviceType || "all"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {popup.createdAt ? popup.createdAt.slice(0, 10) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => openEdit(popup)}>
                          <Pencil className="h-3 w-3 mr-1" />수정
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={() => onDelete(popup)} disabled={deleteMutation.isPending}>
                          <Trash2 className="h-3 w-3 mr-1" />삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── 등록/수정 모달 ── */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-base font-semibold text-[#2f355f]">
                {editId ? "팝업 수정" : "새 팝업 등록"}
              </h2>
              <button onClick={closeForm} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 모달 바디 */}
            <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">제목 <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="팝업 제목을 입력하세요"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  maxLength={200}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">내용</Label>
                <Textarea
                  placeholder="팝업 내용을 입력하세요"
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">링크 URL</Label>
                <Input
                  placeholder="https://example.com 또는 APK 다운로드 경로"
                  value={form.linkUrl}
                  onChange={(e) => setForm((p) => ({ ...p, linkUrl: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">시작일 <span className="text-destructive">*</span></Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">종료일 <span className="text-destructive">*</span></Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Device 타입</Label>
                  <select
                    className={`${selectCls} w-full`}
                    value={form.deviceType}
                    onChange={(e) => setForm((p) => ({ ...p, deviceType: e.target.value }))}
                  >
                    {DEVICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">사용여부</Label>
                  <label className="flex items-center gap-2 h-10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                      className="h-4 w-4 accent-[#2f355f]"
                    />
                    <span className={`text-sm font-medium ${form.isActive ? "text-[#2f355f]" : "text-muted-foreground"}`}>
                      {form.isActive ? "사용" : "미사용"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" onClick={closeForm} className="h-9">
                  취소
                </Button>
                <Button type="submit" disabled={isPending} className="h-9 bg-[#2f355f] hover:bg-[#23284b] text-white">
                  {isPending ? "저장 중..." : editId ? "수정 완료" : "등록"}
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
