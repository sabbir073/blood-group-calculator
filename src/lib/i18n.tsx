/* src/lib/i18n.tsx
 * Simple context‑based i18n helper for English ↔ Bangla.
 * – <LanguageProvider> wraps the app (we'll add it in RootLayout).
 * – useTranslation() gives you a t(key) function bound to the
 *   current language.
 * – useLanguage() returns { lang, toggle() } for the toggle component.
 */
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

/** Translation dictionaries */
const dict = {
  en: {
    title: 'Advanced Blood Group Calculator',
    father_blood_group: "Father's blood group",
    mother_blood_group: "Mother's blood group",
    select_placeholder: '— select —',
    rh_warning_title: 'Rh-incompatibility risk:',
    rh_warning_body: 'Mother is Rh-negative, possible Rh-positive baby. Consult your physician about RhoGAM.',
    prompt_select_parents: "Choose both parents’ blood groups to see results.",
    show_advanced: 'Show advanced systems (Kell, Duffy, MN)',
    hide_advanced: 'Hide advanced systems (Kell, Duffy, MN)',

    other_systems: 'Other blood-group systems',
    kell_title: 'Kell (K/k)',
    mn_title: 'MN',
    duffy_title: 'Duffy (Fy)',
    selector_father: 'Father',
    selector_mother: 'Mother',

    outcome_probabilities: 'Outcome probabilities',
    probability_bullet_prefix: 'There is about',
    probability_bullet_suffix: 'chance the baby will be',

    abo_square_title: 'ABO Punnett square',
    abo_square_desc: 'Rows = mother’s alleles • Columns = father’s alleles.',
    parents_pass_title: 'What the parents can pass on',
    mother_can_pass: 'Mother can pass',
    father_can_pass: 'Father can pass',
    each_cell_shows: 'Each coloured cell shows the baby’s ABO blood type for that allele pairing.',

    rh_square_title: 'Rh Punnett square',
    rh_square_desc: '“+” dominates “−”; any cell with at least one “+” allele is Rh positive.',
    green_boxes_positive: 'Green boxes are Rh positive; rose boxes are Rh negative.',

    compatibility_checker: 'Compatibility checker',
    possible_baby_types: 'Possible baby types:',
    receive_from: 'can receive from',
    donate_to: 'and donate to',
    or: 'or',
    relative_donation_title:  'Important for family donations',
    relative_donation_body:   'Whole-blood or red-cell units from parents, siblings, or children must be irradiated (or pathogen-reduced) to prevent TA-GVHD.',

    genetic_risks: 'Possible genetic / immune concerns',
    risk_rh_title: 'Rh-incompatibility (HDN)',
    risk_rh_desc: 'Mother is Rh-negative and there’s a chance the baby will be Rh-positive. Prophylactic Rh-Ig (RhoGAM) is usually given.',
    risk_abo_title: 'ABO haemolytic disease',
    risk_abo_desc: 'Mother is type O and baby could be A or B. Usually mild but worth monitoring.',
    risk_kell_title: 'Kell incompatibility (HDN)',
    risk_kell_desc: 'Mother lacks Kell antigen (K−) while baby may be K+. Anti-K antibodies can cause severe HDN; close obstetric monitoring recommended.',
    risk_duffy_title: 'Duffy Fy(a−b−) protection',
    risk_duffy_desc: 'If the baby is Fy(a−b−) they will be resistant to Plasmodium vivax malaria. Not a disease risk—rather a protective trait.',
  },

  bn: {
    title: 'এডভান্স রক্তের গ্রুপ ক্যালকুলেটর',
    father_blood_group: 'পিতার রক্তের গ্রুপ',
    mother_blood_group: 'মাতার রক্তের গ্রুপ',
    select_placeholder: '— নির্বাচন করুন —',
    rh_warning_title: 'আরএইচ অসঙ্গতি ঝুঁকি:',
    rh_warning_body: 'মাতা Rh‑নেগেটিভ, শিশুর Rh‑পজিটিভ হওয়ার সম্ভাবনা আছে। RhoGAM সম্পর্কে চিকিৎসকের পরামর্শ নিন।',
    prompt_select_parents: 'ফলাফল দেখতে পিতামাতার দুজনের রক্তের গ্রুপ নির্বাচন করুন।',
    show_advanced: 'এডভান্স সিস্টেমগুলি দেখুন (Kell, Duffy, MN)',
    hide_advanced: 'এডভান্স সিস্টেমগুলি লুকান (Kell, Duffy, MN)',

    other_systems: 'অন্যান্য রক্তের গ্রুপ সিস্টেম',
    kell_title: 'কেল (K/k)',
    mn_title: 'এমএন',
    duffy_title: 'ডাফি (Fy)',
    selector_father: 'পিতা',
    selector_mother: 'মাতা',

    outcome_probabilities: 'সম্ভাব্য ফলাফল',
    probability_bullet_prefix: 'প্রায়',
    probability_bullet_suffix: 'সম্ভাবনা আছে যে শিশু হবে',

    or: 'অথবা',
    relative_donation_title:  'আত্মীয়ের রক্তদানে সতর্কতা',
    relative_donation_body:   'পিতা-মাতা, ভাই-বোন বা সন্তানের দেওয়া সম্পূর্ণ রক্ত/রেড-সেল দেওয়ার আগে TA-GVHD এড়াতে অবশ্যই রক্তটি বিকিরিত (irradiated) বা রোগজীবাণু-হ্রাসকরণ করতে হবে।',

    abo_square_title: 'ABO পানেট স্কয়ার',
    abo_square_desc: 'সারি = মায়ের অ্যালিল • কলাম = পিতার অ্যালিল।',
    parents_pass_title: 'পিতামাতা কী দিতে পারেন',
    mother_can_pass: 'মাতা দিতে পারেন',
    father_can_pass: 'পিতা দিতে পারেন',
    each_cell_shows: 'প্রতিটি রঙিন ঘর সেই অ্যালিল জুটির জন্য শিশুর ABO টাইপ দেখায়।',

    rh_square_title: 'Rh পানেট স্কয়ার',
    rh_square_desc: '“+” “−” এর উপর প্রভাবশালী; কমপক্ষে একটি “+” অ্যালিল থাকলে ঘর Rh পজিটিভ হবে।',
    green_boxes_positive: 'সবুজ ঘর Rh পজিটিভ, গোলাপি ঘর Rh নেগেটিভ।',

    compatibility_checker: 'সামঞ্জস্য পরীক্ষা করুন',
    possible_baby_types: 'সম্ভাব্য শিশুর টাইপসমূহ:',
    receive_from: 'গ্রহণ করতে পারে',
    donate_to: 'এবং প্রদান করতে পারে',

    genetic_risks: 'সম্ভাব্য জিনগত / ইমিউন উদ্বেগ',
    risk_rh_title: 'Rh অসঙ্গতি (HDN)',
    risk_rh_desc: 'মাতা Rh‑নেগেটিভ এবং শিশুর Rh‑পজিটিভ হওয়ার সম্ভাবনা আছে। সাধারণত Rh‑Ig (RhoGAM) দেওয়া হয়।',
    risk_abo_title: 'ABO হেমোলাইটিক রোগ',
    risk_abo_desc: 'মাতা O টাইপ এবং শিশু A বা B হতে পারে। সাধারণত হালকা, তবে নজরদারি প্রয়োজন।',
    risk_kell_title: 'কেল অসঙ্গতি (HDN)',
    risk_kell_desc: 'মাতার Kell অ্যান্টিজেন নেই (K−) কিন্তু শিশুর K+ হতে পারে; গুরুতর HDN হতে পারে, নিবিড় পর্যবেক্ষণ জরুরি।',
    risk_duffy_title: 'ডাফি Fy(a−b−) সুরক্ষা',
    risk_duffy_desc: 'যদি শিশু Fy(a−b−) হয় তবে Plasmodium vivax ম্যালেরিয়া থেকে সুরক্ষিত থাকবে। এটি রোগ নয় বরং সুরক্ষামূলক বৈশিষ্ট্য।',
  },
} as const;

type Lang = keyof typeof dict;

interface Ctx {
  lang: Lang;
  toggle: () => void;
  t: (k: keyof typeof dict['en']) => string;
}

const I18nContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const toggle = () => setLang(l => (l === 'en' ? 'bn' : 'en'));
  const t = (k: keyof typeof dict['en']) => dict[lang][k] ?? k;
  return (
    <I18nContext.Provider value={{ lang, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return { lang: ctx.lang, toggle: ctx.toggle };
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider');
  return ctx.t;
}
