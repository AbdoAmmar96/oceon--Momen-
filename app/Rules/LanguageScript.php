<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Guards a translation field so each language tab holds text in its own script.
 *
 * Two modes, both deliberately lenient about brand names and model numbers
 * (Latin technical tokens are legitimate even inside an Arabic title):
 *
 *  - 'arabic': the value MUST contain at least one Arabic letter. This blocks
 *    the common mistake of pasting the English text into the Arabic tab, while
 *    still allowing "حفارة Atlas Copco RD20".
 *  - 'latin':  the value must NOT contain any Arabic letters. Used for the
 *    English and French tabs. (English vs. French cannot be told apart by
 *    script — both are Latin — so we only reject Arabic content here.)
 */
class LanguageScript implements ValidationRule
{
    public function __construct(private string $mode = 'latin')
    {
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $value = is_string($value) ? trim($value) : '';

        if ($value === '') {
            return; // emptiness is handled by `required`, not by this rule
        }

        $hasArabic = preg_match('/\p{Arabic}/u', $value) === 1;

        if ($this->mode === 'arabic' && ! $hasArabic) {
            $fail('يجب إدخال هذا الحقل باللغة العربية.');

            return;
        }

        if ($this->mode === 'latin' && $hasArabic) {
            $fail('This field must not contain Arabic text — use the Arabic tab instead.');
        }
    }
}
