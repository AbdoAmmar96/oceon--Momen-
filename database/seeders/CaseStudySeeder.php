<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use Illuminate\Database\Seeder;

class CaseStudySeeder extends Seeder
{
    public function run(): void
    {
        CaseStudy::firstOrCreate(
            ['slug' => 'supplying-drilling-equipment-to-a-mining-contractor'],
            [
                'title_en' => 'Supplying Drilling Equipment to a Mining Contractor',
                'title_ar' => 'توريد معدات حفر لمقاول تعدين',
                'title_fr' => "Fourniture d'équipements de forage à un entrepreneur minier",
                'summary_en' => 'A complete drilling package sourced, inspected and delivered on schedule to a remote mining site.',
                'summary_ar' => 'حزمة حفر كاملة تم توريدها وفحصها وتسليمها في الموعد إلى موقع تعدين نائٍ.',
                'summary_fr' => "Un ensemble de forage complet sourcé, inspecté et livré dans les délais sur un site minier isolé.",
                'client_name' => 'Confidential Mining Contractor',
                'client_industry' => 'Mining & Minerals',
                'country' => 'Democratic Republic of the Congo',
                'equipment_supplied' => 'DTH hammers, drill pipes, air compressor & genuine spares',
                'supplied_date' => '2025-03-01',
                'challenge_en' => 'The contractor needed a full drilling package delivered to a remote site on a tight deadline, with no room for compatibility mistakes.',
                'challenge_ar' => 'احتاج المقاول إلى حزمة حفر كاملة تُسلَّم إلى موقع نائٍ في مهلة ضيقة، دون أي مجال للأخطاء في التوافق.',
                'challenge_fr' => "L'entrepreneur avait besoin d'un ensemble de forage complet livré sur un site isolé dans un délai serré, sans marge d'erreur de compatibilité.",
                'solution_en' => 'We matched every item to the client machines, inspected the equipment before shipping, and handled export documentation and logistics end-to-end.',
                'solution_ar' => 'طابقنا كل صنف مع ماكينات العميل، وفحصنا المعدات قبل الشحن، وتولّينا مستندات التصدير واللوجستيات من الباب للباب.',
                'solution_fr' => "Nous avons associé chaque article aux machines du client, inspecté le matériel avant expédition et géré la documentation d'export et la logistique de bout en bout.",
                'result_en' => 'The package arrived on site ahead of schedule and the rig was back in production within days, with zero compatibility returns.',
                'result_ar' => 'وصلت الحزمة إلى الموقع قبل الموعد، وعاد الحفار للإنتاج خلال أيام، دون أي مرتجعات بسبب عدم التوافق.',
                'result_fr' => "L'ensemble est arrivé sur site en avance et la foreuse a repris la production en quelques jours, sans aucun retour de compatibilité.",
                'is_active' => true,
                'sort' => 0,
            ],
        );
    }
}
