<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

/**
 * The board members carried over from the previous site
 * (oceandrilling.co.uk/ar/board_members), keeping each person's original job
 * title. Two have real photos supplied by the client; the rest fall back to the
 * neutral avatar until their photos arrive — the admin can upload them, edit
 * any detail, or add new members from the Team resource at any time.
 */
class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'name' => 'Eng. Wajih Abdel Hamid',
                'name_ar' => 'م. وجيه عبد الحميد',
                'role_en' => 'Executive Director',
                'role_ar' => 'المدير التنفيذي',
                'role_fr' => 'Directeur exécutif',
                'photo' => 'img/team/wajih-abdelhamid.jpeg',
            ],
            [
                'name' => 'Abu Canany',
                'name_ar' => 'أبو كناني',
                'role_en' => 'Sales & Marketing — Saudi Arabia Branch',
                'role_ar' => 'المبيعات والتسويق — فرع المملكة العربية السعودية',
                'role_fr' => 'Ventes & Marketing — Succursale d’Arabie Saoudite',
                'photo' => 'img/team/abu-canany.jpeg',
            ],
            [
                'name' => 'Waleed Abdel Hamid',
                'name_ar' => 'وليد عبد الحميد',
                'role_en' => 'Sales & Marketing — Egypt Branch',
                'role_ar' => 'المبيعات والتسويق — فرع مصر',
                'role_fr' => 'Ventes & Marketing — Succursale d’Égypte',
                'photo' => 'img/team/waleed-abdelhamid.jpg',
            ],
            [
                'name' => 'Ibrahim Zenikri',
                'name_ar' => 'إبراهيم زنيكري',
                'role_en' => 'Sales & Marketing — Algeria Branch',
                'role_ar' => 'المبيعات والتسويق — فرع الجزائر',
                'role_fr' => 'Ventes & Marketing — Succursale d’Algérie',
                'photo' => 'img/team/ibrahim-zenikri.jpg',
            ],
            [
                'name' => 'Tayseer Al-Aqrbawy',
                'name_ar' => 'تيسير العقرباوي',
                'role_en' => 'Sales & Marketing — Sudan Branch',
                'role_ar' => 'المبيعات والتسويق — فرع السودان',
                'role_fr' => 'Ventes & Marketing — Succursale du Soudan',
                // Only a 200×150 thumbnail survives on the old site; replace it
                // from the admin as soon as a full-size photo is available.
                'photo' => 'img/team/tayseer-alaqrbawy.jpg',
            ],
            [
                'name' => 'Khaled Al-Mutairi',
                'name_ar' => 'خالد المطيري',
                'role_en' => 'Drilling Broker & Sales',
                'role_ar' => 'وسيط ومبيعات الحفر',
                'role_fr' => 'Courtier et ventes de forage',
                'photo' => 'img/team/khaled-almutairi.jpg',
            ],
            [
                'name' => 'Admos Senekis',
                'name_ar' => 'أدموس سينيكيس',
                'role_en' => 'Chief Engineer',
                'role_ar' => 'كبير المهندسين',
                'role_fr' => 'Ingénieur en chef',
                'photo' => 'img/team/admos-senekis.jpg',
            ],
        ];

        foreach ($members as $i => $m) {
            TeamMember::updateOrCreate(
                ['name' => $m['name']],
                array_merge($m, ['is_active' => true, 'sort' => $i + 1]),
            );
        }

        /*
         * An earlier version of this seeder inserted four generic job-title
         * placeholders. They are not real people, and on an already-seeded site
         * they sit alongside the real board. Drop them — but only while they are
         * still untouched (no photo, no Arabic name), so a genuine member the
         * client happened to name this way is never removed.
         */
        TeamMember::query()
            ->whereIn('name', [
                'Managing Director',
                'Head of Trading & Sales',
                'Technical Director',
                'Export & Logistics Manager',
            ])
            ->whereNull('photo')
            ->whereNull('name_ar')
            ->delete();
    }
}
