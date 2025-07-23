import { StoreApi, UseBoundStore } from "zustand";
import { useAppStore } from "./appStore";
import { useLanguageStore } from "./languageStore";
import useRoleStore from "./role";
import useUserStore from "./user";
import usePermissionStore from "./permission";
import useGradeLevelStore from "./gradeLevel";
import useExamTypeStore from "./examType";
import useSubjectStore from "./subject";
import useExamStore from "./exam";
import useExamChangeRequestStore from "./examChangeRequest";

const storeMap: Record<string, UseBoundStore<StoreApi<any>>> = {

  user: useUserStore,
  role: useRoleStore,
  gradeLevel: useGradeLevelStore,
  examType: useExamTypeStore,
  subject: useSubjectStore,
  exam: useExamStore,
  'exam-change-request': useExamChangeRequestStore,

  language: useLanguageStore,
  app: useAppStore,
  permission: usePermissionStore,

}

export const getStore = (storeName: string | undefined) => {
  return storeName ? storeMap[storeName] : (() => ({}))
}