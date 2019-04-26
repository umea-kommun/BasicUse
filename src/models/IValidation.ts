import * as Enums from '@/models/Enums';

/**
 * Beskriver en samling valideringsregler som används för att validera inmatat data
 */
export interface IValidation {
  rules: IValidationRule[];
}

/**
 * Beskriver en valideringsregel av en viss typ (finns som Enum).
 * Value är valfri och används endast av vissa typer av valideringar
 */
export interface IValidationRule {
  type: Enums.ValidationRuleType;
  requiresValue?: boolean;
  title?: string;
  value?: string | number;
}
