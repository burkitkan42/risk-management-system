export const SCORE_SCALE = [1, 2, 3, 4, 5];

export const PROBABILITY_SCALE = [
  { score: 1, name: "Редко", description: "Реже 1 раза в 5 лет" },
  { score: 2, name: "Маловероятно", description: "Примерно 1 раз в 3-5 лет" },
  { score: 3, name: "Возможно", description: "Примерно 1 раз в 1-3 года" },
  { score: 4, name: "Вероятно", description: "Примерно 1 раз в год" },
  { score: 5, name: "Практически неизбежно", description: "Несколько раз в год" },
];

export const IMPACT_SCALE = [
  { score: 1, name: "Незначительное", description: "Потери < 0,1% годового бюджета" },
  { score: 2, name: "Низкое", description: "Потери 0,1-1% годового бюджета" },
  { score: 3, name: "Умеренное", description: "Потери 1-5% годового бюджета" },
  { score: 4, name: "Высокое", description: "Потери 5-15% годового бюджета" },
  { score: 5, name: "Критическое", description: "Потери > 15% годового бюджета" },
];

export interface ZoneDef {
  from: number;
  to: number;
  name: string;
  color: string;
  textColor: string;
  response: string;
}

export const ZONES: ZoneDef[] = [
  { from: 1, to: 4, name: "Незначительный", color: "#00B050", textColor: "#ffffff", response: "Принятие риска, мониторинг без дополнительных мер" },
  { from: 5, to: 9, name: "Низкий", color: "#A9D18E", textColor: "#1a1a1a", response: "Принятие риска либо точечные меры контроля" },
  { from: 10, to: 14, name: "Средний", color: "#FFFF00", textColor: "#1a1a1a", response: "Разработка мер снижения риска, назначение ответственного" },
  { from: 15, to: 19, name: "Высокий", color: "#FFC000", textColor: "#1a1a1a", response: "Обязательный план обработки, регулярный контроль руководством" },
  { from: 20, to: 25, name: "Критический", color: "#FF0000", textColor: "#ffffff", response: "Немедленное реагирование, эскалация руководству" },
];

export const CATEGORIES = [
  "Операционный",
  "Финансовый",
  "Комплаенс",
  "HR (кадровый)",
  "ИБ (информационная безопасность)",
  "Стратегический",
  "Проектный",
  "Репутационный",
];

export const STRATEGIES = ["Избежание", "Снижение", "Передача", "Принятие"];

export const RISK_STATUSES = ["Открыт", "В работе", "Под контролем", "Закрыт"];

export const CONTROL_EFFECTIVENESS = ["Эффективен", "Частично эффективен", "Неэффективен", "Отсутствует"];

export const PLAN_STATUSES = ["Не начато", "В работе", "Завершено", "Просрочено", "Отменено"];
