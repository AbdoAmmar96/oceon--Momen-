<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

/**
 * Sample team members so the Team page looks complete out of the box. These are
 * placeholders — the client replaces the names, photos and bios from the admin
 * (Team resource). No photos are set, so each shows a neutral avatar until one
 * is uploaded.
 */
class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'name' => 'Managing Director',
                'role_en' => 'Managing Director', 'role_ar' => 'المدير العام', 'role_fr' => 'Directeur général',
                'bio_en' => 'Leads the company vision and the long-term relationships with factories and clients.',
                'bio_ar' => 'يقود رؤية الشركة والعلاقات طويلة الأمد مع المصانع والعملاء.',
                'bio_fr' => "Porte la vision de l'entreprise et les relations durables avec les usines et les clients.",
            ],
            [
                'name' => 'Head of Trading & Sales',
                'role_en' => 'Head of Trading & Sales', 'role_ar' => 'رئيس التجارة والمبيعات', 'role_fr' => 'Responsable négoce & ventes',
                'bio_en' => 'Owns sourcing and client quotes across the Middle East, Africa and Europe.',
                'bio_ar' => 'مسؤول عن التوريد وعروض الأسعار عبر الشرق الأوسط وأفريقيا وأوروبا.',
                'bio_fr' => "Responsable du sourcing et des devis clients au Moyen-Orient, en Afrique et en Europe.",
            ],
            [
                'name' => 'Technical Director',
                'role_en' => 'Technical Director', 'role_ar' => 'المدير الفني', 'role_fr' => 'Directeur technique',
                'bio_en' => 'Verifies condition and specification of every rig and part before it ships.',
                'bio_ar' => 'يتحقق من حالة ومواصفات كل حفار وقطعة قبل الشحن.',
                'bio_fr' => "Vérifie l'état et les spécifications de chaque foreuse et pièce avant expédition.",
            ],
            [
                'name' => 'Export & Logistics Manager',
                'role_en' => 'Export & Logistics Manager', 'role_ar' => 'مدير التصدير واللوجستيات', 'role_fr' => 'Responsable export & logistique',
                'bio_en' => 'Handles documentation, freight and customs so orders arrive without surprises.',
                'bio_ar' => 'يتولى المستندات والشحن والجمارك ليصل الطلب بلا مفاجآت.',
                'bio_fr' => "Gère documents, fret et douanes pour des commandes livrées sans surprises.",
            ],
        ];

        foreach ($members as $i => $m) {
            TeamMember::firstOrCreate(
                ['name' => $m['name']],
                array_merge($m, ['is_active' => true, 'sort' => $i + 1]),
            );
        }
    }
}
