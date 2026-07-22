<?php

namespace Tests\Feature;

use App\Filament\Resources\TeamMemberResource\Pages\EditTeamMember;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * A seeded portrait lives in public/img/team, not on the "public" storage disk.
 * Filament checks the disk before rendering a FileUpload, so without
 * fetchFileInformation(false) it treats the file as missing, hydrates the field
 * empty, and saving an unrelated edit writes NULL over the photo.
 */
class PhotoPreservedTest extends TestCase
{
    use RefreshDatabase;

    public function test_editing_a_seeded_member_keeps_their_photo(): void
    {
        $this->actingAs(User::create([
            'name' => 'Admin', 'email' => 'a@b.test',
            'password' => 'secret-only-for-this-test', 'role' => User::ROLE_ADMIN,
        ]));

        $member = TeamMember::create([
            'name' => 'Eng. Wajih Abdel Hamid',
            'role_en' => 'Executive Director',
            'photo' => 'img/team/wajih-abdelhamid.jpeg',
            'is_active' => true,
        ]);

        Livewire::test(EditTeamMember::class, ['record' => $member->getKey()])
            ->assertFormSet(fn (array $state) => $this->assertNotEmpty(
                $state['photo'], 'photo field hydrated empty — it will be wiped on save'
            ) ?? [])
            ->fillForm(['role_en' => 'Executive Director (updated)'])
            ->call('save')
            ->assertHasNoFormErrors();

        $member->refresh();

        $this->assertSame('Executive Director (updated)', $member->role_en, 'the edit did not apply');
        $this->assertSame(
            'img/team/wajih-abdelhamid.jpeg',
            $member->photo,
            'the seeded photo was wiped by an unrelated edit',
        );
    }
}
