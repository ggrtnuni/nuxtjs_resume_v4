/**
 * 履歴書 状態管理 コンポーザブル
 * 
 * @author ggrtn
 */

import { ref } from 'vue';
import format from '~/utils/format';
import validator from '~/utils/validator';
import { type ResumeHistory, type ResumeJson } from '~/types/resume'; // verbatimModuleSyntax

const resumeDate = ref<string>(format.date());
const resumeNameKana = ref<string>('');
const resumeName = ref<string>('');
const resumeGender = ref<string>('0');
const resumeBirthday = ref<string>('');
const resumePostalcode = ref<string>('');
const resumeAddressKana = ref<string>('');
const resumeAddress = ref<string>('');
const resumeEmail = ref<string>('');
const resumeTel = ref<string>('');
const resumeMobile = ref<string>('');
const resumeContactPostalcode = ref<string>('');
const resumeContactAddressKana = ref<string>('');
const resumeContactAddress = ref<string>('');
const resumeContactTel = ref<string>('');
const resumeHistory = ref<ResumeHistory>({ rows: [] });
const resumeLicense = ref<ResumeHistory>({ rows: [] });
const resumeMotivation = ref<string>('');
const resumeWish = ref<string>('');

// view state
const resumeCalender = ref<string>('en');
const resumeContact = ref<boolean>(true);
const resumeVisibility = ref<boolean>(true);
const resumeSaveFilename = ref<string>('resume');

export const useResumeState = () => {
    return {
        resumeDate,
        resumeDateText() {
            let result = '';
            if (validator.date(this.resumeDate.value)) {
                const date = new Date(this.resumeDate.value);
                result = format.year(this.resumeCalender.value, date.getFullYear());
                result += ' 年';
                result += ' ' + (date.getMonth() + 1) + ' 月';
                result += ' ' + date.getDate() + ' 日 現在';
            } else {
                result += '年　　月　　日 現在';
            }
            return result;
        },
        resumeNameKana,
        resumeName,
        resumeGender,
        resumeGenderText() {
            return this.resumeGender.value === '1' ? '男' : (this.resumeGender.value === '2' ? '女' : '-');
        },
        resumeBirthday,
        resumeBirthdayText() {
            let result = '';
            if (validator.date(this.resumeBirthday.value)) {
                const now = validator.date(this.resumeDate.value) ? new Date(this.resumeDate.value) : new Date();
                const date = new Date(this.resumeBirthday.value);
                const thisYearBirthday = format.thisYear(date, now);
                const age = now.getFullYear() - date.getFullYear() - 1 + (now.getTime() >= thisYearBirthday.getTime() ? 1 : 0);
                result = format.year(this.resumeCalender.value, date.getFullYear()) + ' 年';
                result += ' ' + (date.getMonth() + 1) + ' 月';
                result += ' ' + date.getDate() + ' 日';
                result += ' ( 満 ' + age + ' 歳 )';
            }
            return result;
        },
        resumePostalcode,
        resumeAddressKana,
        resumeAddress,
        resumeAddressText() {
            let result = '';
            if (validator.postalcode(this.resumePostalcode.value)) {
                result = '〒 ' + this.resumePostalcode.value;
            }
            if (validator.string(this.resumeAddress.value)) {
                if (result.length > 0) {
                    result += "\n";
                }
                result += this.resumeAddress.value;
            }
            return result;
        },
        resumeEmail,
        resumeTel,
        resumeMobile,
        resumeContactPostalcode,
        resumeContactAddressKana,
        resumeContactAddress,
        resumeContactAddressText() {
            let result = '';
            if (validator.postalcode(this.resumeContactPostalcode.value)) {
                result = '〒 ' + this.resumeContactPostalcode;
            }
            if (validator.string(this.resumeContactAddress.value)) {
                if (result.length > 0) {
                    result += "\n";
                }
                result += this.resumeContactAddress;
            }
            return result;
        },
        resumeContactTel,
        resumeHistory,
        resumeLicense,
        resumeMotivation,
        resumeWish,

        // view state
        resumeCalender,
        resumeContact,
        resumeVisibility,
        resumeSaveFilename,

        // method
        empty() {
            this.resumeDate.value = format.date();
            this.resumeNameKana.value = '';
            this.resumeName.value = '';
            this.resumeGender.value = '0';
            this.resumeBirthday.value = '';
            this.resumePostalcode.value = '';
            this.resumeAddressKana.value = '';
            this.resumeAddress.value = '';
            this.resumeEmail.value = '';
            this.resumeTel.value = '';
            this.resumeMobile.value = '';
            this.resumeContactPostalcode.value = '';
            this.resumeContactAddressKana.value = '';
            this.resumeContactAddress.value = '';
            this.resumeContactTel.value = '';
            while (this.resumeHistory.value.rows.pop());
            while (this.resumeLicense.value.rows.pop());
            this.resumeMotivation.value = '';
            this.resumeWish.value = '';
        },
        loadResumeFromJson(json: ResumeJson) {
            this.empty();

            this.resumeDate.value = json.resumeDate;
            this.resumeNameKana.value = json.resumeNameKana;
            this.resumeName.value = json.resumeName;
            this.resumeGender.value = json.resumeGender;
            this.resumeBirthday.value = json.resumeBirthday;
            this.resumePostalcode.value = json.resumePostalcode;
            this.resumeAddressKana.value = json.resumeAddressKana;
            this.resumeAddress.value = json.resumeAddress;
            this.resumeEmail.value = json.resumeEmail;
            this.resumeTel.value = json.resumeTel;
            this.resumeMobile.value = json.resumeMobile;
            this.resumeContactPostalcode.value = json.resumeContactPostalcode;
            this.resumeContactAddressKana.value = json.resumeContactAddressKana;
            this.resumeContactAddress.value = json.resumeContactAddress;
            this.resumeContactTel.value = json.resumeContactTel;
            this.resumeHistory.value = json.resumeHistory;
            this.resumeLicense.value = json.resumeLicense;
            // json.resumeHistory.rows.forEach((row) => {
            //     this.resumeHistory.value.rows.push(row);
            // });
            // json.resumeLicense.rows.forEach((row) => {
            //     this.resumeLicense.value.rows.push(row);
            // });
            this.resumeMotivation.value = json.resumeMotivation;
            this.resumeWish.value = json.resumeWish;

            this.resumeCalender.value = json.resumeCalender;
            this.resumeContact.value = json.resumeContact;
            this.resumeSaveFilename.value = json.resumeSaveFilename;

            // json.resumeIdPhoto;
        },
        loadResumeFromFile() {

        },
    };
}