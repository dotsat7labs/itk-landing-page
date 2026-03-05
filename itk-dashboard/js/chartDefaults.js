/**
 * SpendShark — Agentic Edition | Global Chart.js Defaults
 * Aligns chart styling with landing page visual identity.
 *
 * NOTE: Do NOT set Chart.defaults.borderColor globally — in Chart.js v4 it
 * is used as the fallback borderColor for datasets, making all lines invisible
 * if set to a near-transparent value. Configure grid/border colors per-scale.
 */
export function applyChartDefaults() {
    if (typeof Chart === 'undefined') return;

    const NEON_CYAN    = '#00f3ff';
    const GRID_LINE    = 'rgba(255, 255, 255, 0.08)';
    const TICK_COLOR   = '#9ca3af';
    const LEGEND_COLOR = '#d1d5db';

    // Font & default text color
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size   = 11;
    Chart.defaults.color       = TICK_COLOR;
    // ⚠️  Do NOT set Chart.defaults.borderColor here — it shadows dataset borderColors.

    // Legend
    Chart.defaults.plugins.legend.labels.color    = LEGEND_COLOR;
    Chart.defaults.plugins.legend.labels.boxWidth = 10;
    Chart.defaults.plugins.legend.labels.padding  = 16;

    // Tooltip
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10, 10, 15, 0.92)';
    Chart.defaults.plugins.tooltip.borderColor     = 'rgba(0, 243, 255, 0.3)';
    Chart.defaults.plugins.tooltip.borderWidth     = 1;
    Chart.defaults.plugins.tooltip.titleColor      = NEON_CYAN;
    Chart.defaults.plugins.tooltip.bodyColor       = LEGEND_COLOR;
    Chart.defaults.plugins.tooltip.cornerRadius    = 8;
    Chart.defaults.plugins.tooltip.padding         = 10;

    // Scale defaults — mutate existing objects, never replace them
    const scales = Chart.defaults.scales || {};
    ['linear', 'category', 'logarithmic', 'time'].forEach(type => {
        if (!scales[type]) return;
        scales[type].grid  = scales[type].grid  || {};
        scales[type].ticks = scales[type].ticks || {};
        scales[type].grid.color     = GRID_LINE;
        scales[type].ticks.color    = TICK_COLOR;
    });

    // Line element defaults
    Chart.defaults.elements.line.tension     = 0.4;
    Chart.defaults.elements.line.borderWidth = 2;
    Chart.defaults.elements.point.radius     = 3;
    Chart.defaults.elements.point.hoverRadius = 5;

    // Bar element defaults
    Chart.defaults.elements.bar.borderRadius  = 4;
    Chart.defaults.elements.bar.borderSkipped = false;

    // Global responsive behaviour (charts still set their own options)
    Chart.defaults.responsive          = true;
    Chart.defaults.maintainAspectRatio = false;
}

/** Shared color palette for datasets */
export const CHART_COLORS = {
    cyan:   '#00f3ff',
    purple: '#7b2cbf',
    green:  '#10b981',
    amber:  '#f59e0b',
    blue:   '#3b82f6',
    red:    '#ef4444',
    pink:   '#ec4899',
    indigo: '#6366f1',
};

export const CHART_COLORS_ALPHA = (color, alpha) => {
    const map = {
        '#00f3ff': `rgba(0, 243, 255, ${alpha})`,
        '#7b2cbf': `rgba(123, 44, 191, ${alpha})`,
        '#10b981': `rgba(16, 185, 129, ${alpha})`,
        '#f59e0b': `rgba(245, 158, 11, ${alpha})`,
        '#3b82f6': `rgba(59, 130, 246, ${alpha})`,
        '#ef4444': `rgba(239, 68, 68, ${alpha})`,
        '#ec4899': `rgba(236, 72, 153, ${alpha})`,
        '#6366f1': `rgba(99, 102, 241, ${alpha})`,
    };
    return map[color] || color;
};
