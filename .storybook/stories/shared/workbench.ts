import { Enum } from '../../../src';

export const TicketStatusEnum = Enum(
  {
    Draft: {
      value: 'draft',
      label: 'storybook.enums.status.draft',
      badgeStatus: 'default',
      color: 'default',
      shortLabel: 'DR',
      hint: 'storybook.enums.statusHint.draft',
      weight: 1,
    },
    Triage: {
      value: 'triage',
      label: 'storybook.enums.status.triage',
      badgeStatus: 'processing',
      color: 'blue',
      shortLabel: 'TR',
      hint: 'storybook.enums.statusHint.triage',
      weight: 2,
    },
    Blocked: {
      value: 'blocked',
      label: 'storybook.enums.status.blocked',
      badgeStatus: 'error',
      color: 'red',
      shortLabel: 'BL',
      hint: 'storybook.enums.statusHint.blocked',
      weight: 5,
    },
    InProgress: {
      value: 'inProgress',
      label: 'storybook.enums.status.inProgress',
      badgeStatus: 'warning',
      color: 'gold',
      shortLabel: 'IP',
      hint: 'storybook.enums.statusHint.inProgress',
      weight: 3,
    },
    Resolved: {
      value: 'resolved',
      label: 'storybook.enums.status.resolved',
      badgeStatus: 'success',
      color: 'green',
      shortLabel: 'RS',
      hint: 'storybook.enums.statusHint.resolved',
      weight: 4,
    },
  },
  { name: 'storybook.enums.status.enumName' },
);

export const TicketPriorityEnum = Enum(
  {
    Critical: {
      value: 'critical',
      label: 'storybook.enums.priority.critical',
      badgeStatus: 'error',
      color: 'volcano',
      shortLabel: 'P0',
      hint: 'storybook.enums.priorityHint.critical',
      weight: 100,
    },
    High: {
      value: 'high',
      label: 'storybook.enums.priority.high',
      badgeStatus: 'warning',
      color: 'orange',
      shortLabel: 'P1',
      hint: 'storybook.enums.priorityHint.high',
      weight: 80,
    },
    Medium: {
      value: 'medium',
      label: 'storybook.enums.priority.medium',
      badgeStatus: 'processing',
      color: 'blue',
      shortLabel: 'P2',
      hint: 'storybook.enums.priorityHint.medium',
      weight: 50,
    },
    Low: {
      value: 'low',
      label: 'storybook.enums.priority.low',
      badgeStatus: 'default',
      color: 'default',
      shortLabel: 'P3',
      hint: 'storybook.enums.priorityHint.low',
      weight: 20,
    },
  },
  { name: 'storybook.enums.priority.enumName' },
);

export const TicketChannelEnum = Enum(
  {
    ProductBoard: {
      value: 'productBoard',
      label: 'storybook.enums.channel.productBoard',
      color: 'geekblue',
      hint: 'storybook.enums.channelHint.productBoard',
    },
    VipDesk: {
      value: 'vipDesk',
      label: 'storybook.enums.channel.vipDesk',
      color: 'magenta',
      hint: 'storybook.enums.channelHint.vipDesk',
    },
    OpsDesk: {
      value: 'opsDesk',
      label: 'storybook.enums.channel.opsDesk',
      color: 'cyan',
      hint: 'storybook.enums.channelHint.opsDesk',
    },
    PartnerPortal: {
      value: 'partnerPortal',
      label: 'storybook.enums.channel.partnerPortal',
      color: 'purple',
      hint: 'storybook.enums.channelHint.partnerPortal',
    },
  },
  { name: 'storybook.enums.channel.enumName' },
);

export const TicketOwnerEnum = Enum(
  {
    Amy: {
      value: 'amy',
      label: 'storybook.enums.owner.amy',
      color: 'blue',
      hint: 'storybook.enums.ownerRole.amy',
    },
    Ben: {
      value: 'ben',
      label: 'storybook.enums.owner.ben',
      color: 'gold',
      hint: 'storybook.enums.ownerRole.ben',
    },
    Cora: {
      value: 'cora',
      label: 'storybook.enums.owner.cora',
      color: 'green',
      hint: 'storybook.enums.ownerRole.cora',
    },
    Dylan: {
      value: 'dylan',
      label: 'storybook.enums.owner.dylan',
      color: 'purple',
      hint: 'storybook.enums.ownerRole.dylan',
    },
  },
  { name: 'storybook.enums.owner.enumName' },
);

export const TicketRegionEnum = Enum(
  {
    CnNorth: {
      value: 'cnNorth',
      label: 'storybook.enums.region.cnNorth',
      color: 'red',
      hint: 'storybook.enums.regionHint.cnNorth',
    },
    EuWest: {
      value: 'euWest',
      label: 'storybook.enums.region.euWest',
      color: 'blue',
      hint: 'storybook.enums.regionHint.euWest',
    },
    UsEast: {
      value: 'usEast',
      label: 'storybook.enums.region.usEast',
      color: 'green',
      hint: 'storybook.enums.regionHint.usEast',
    },
  },
  { name: 'storybook.enums.region.enumName' },
);

export const TicketSeverityEnum = Enum(
  {
    Sev1: {
      value: 'sev1',
      label: 'storybook.enums.severity.sev1',
      color: 'volcano',
      hint: 'storybook.enums.severityHint.sev1',
      weight: 90,
    },
    Sev2: {
      value: 'sev2',
      label: 'storybook.enums.severity.sev2',
      color: 'orange',
      hint: 'storybook.enums.severityHint.sev2',
      weight: 60,
    },
    Sev3: {
      value: 'sev3',
      label: 'storybook.enums.severity.sev3',
      color: 'blue',
      hint: 'storybook.enums.severityHint.sev3',
      weight: 30,
    },
  },
  { name: 'storybook.enums.severity.enumName' },
);

export const TicketFlagEnum = Enum(
  {
    SlaRisk: {
      value: 'slaRisk',
      label: 'storybook.enums.flag.slaRisk',
      color: 'red',
      hint: 'storybook.enums.flagHint.slaRisk',
    },
    CustomerEscalated: {
      value: 'customerEscalated',
      label: 'storybook.enums.flag.customerEscalated',
      color: 'gold',
      hint: 'storybook.enums.flagHint.customerEscalated',
    },
    RequiresRollback: {
      value: 'requiresRollback',
      label: 'storybook.enums.flag.requiresRollback',
      color: 'volcano',
      hint: 'storybook.enums.flagHint.requiresRollback',
    },
    NeedsTranslation: {
      value: 'needsTranslation',
      label: 'storybook.enums.flag.needsTranslation',
      color: 'cyan',
      hint: 'storybook.enums.flagHint.needsTranslation',
    },
  },
  { name: 'storybook.enums.flag.enumName' },
);

export const TableModeEnum = Enum(
  {
    All: {
      value: 'all',
      label: 'storybook.enums.view.all',
      hint: 'storybook.enums.viewHint.all',
    },
    MyOpen: {
      value: 'myOpen',
      label: 'storybook.enums.view.myOpen',
      hint: 'storybook.enums.viewHint.myOpen',
    },
    Risk: {
      value: 'risk',
      label: 'storybook.enums.view.risk',
      hint: 'storybook.enums.viewHint.risk',
    },
  },
  { name: 'storybook.enums.view.enumName' },
);

export const channelOptions = TicketChannelEnum.items.map((option) => {
  const raw = TicketChannelEnum.raw(option.value);
  return {
    ...option,
    searchText: `${TicketChannelEnum.findBy('value', option.value)?.label ?? ''} ${raw?.hint ?? ''}`,
  };
});

export interface TicketFormValues {
  title: string;
  status: typeof TicketStatusEnum.valueType;
  priority: typeof TicketPriorityEnum.valueType;
  channel: typeof TicketChannelEnum.valueType;
  owner: typeof TicketOwnerEnum.valueType;
  region: typeof TicketRegionEnum.valueType;
  severity: typeof TicketSeverityEnum.valueType;
  preferredView: typeof TableModeEnum.valueType;
  flags: (typeof TicketFlagEnum.valueType)[];
}

export type TicketRecord = TicketFormValues & {
  id: string;
  key: string;
  createdAt: string;
  updatedAt: string;
  noteCount: number;
  tenant: string;
};

export function formatNow() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function extractRequestNumber(id: string) {
  const match = /^REQ-(\d+)$/.exec(id);
  return match ? Number(match[1]) : 0;
}

export function getNextRequestNumber(records: TicketRecord[]) {
  return records.reduce((max, record) => Math.max(max, extractRequestNumber(record.id)), 0) + 1;
}

export function createInitialRecords(): TicketRecord[] {
  return [
    {
      id: 'REQ-1042',
      key: 'REQ-1042',
      title: 'Checkout discount rules fail for EU enterprise tenants',
      status: 'blocked',
      priority: 'critical',
      channel: 'vipDesk',
      owner: 'amy',
      region: 'euWest',
      severity: 'sev1',
      preferredView: 'risk',
      flags: ['slaRisk', 'customerEscalated', 'requiresRollback'],
      createdAt: '2026-05-31 18:20',
      updatedAt: '2026-06-02 20:16',
      noteCount: 7,
      tenant: 'Atlas Retail Group',
    },
    {
      id: 'REQ-1048',
      key: 'REQ-1048',
      title: 'Partner portal webhook retries need a clearer triage owner',
      status: 'triage',
      priority: 'high',
      channel: 'partnerPortal',
      owner: 'ben',
      region: 'usEast',
      severity: 'sev2',
      preferredView: 'all',
      flags: ['needsTranslation'],
      createdAt: '2026-06-01 10:18',
      updatedAt: '2026-06-03 09:05',
      noteCount: 3,
      tenant: 'Northwind Partners',
    },
    {
      id: 'REQ-1051',
      key: 'REQ-1051',
      title: 'Billing export labels should match new ops desk workflow',
      status: 'inProgress',
      priority: 'medium',
      channel: 'opsDesk',
      owner: 'cora',
      region: 'cnNorth',
      severity: 'sev3',
      preferredView: 'myOpen',
      flags: ['needsTranslation'],
      createdAt: '2026-06-01 14:42',
      updatedAt: '2026-06-03 07:58',
      noteCount: 5,
      tenant: 'Lingxiao Commerce',
    },
    {
      id: 'REQ-1057',
      key: 'REQ-1057',
      title: 'Self-serve upgrade flow needs copy update before release',
      status: 'resolved',
      priority: 'low',
      channel: 'productBoard',
      owner: 'dylan',
      region: 'usEast',
      severity: 'sev3',
      preferredView: 'all',
      flags: [],
      createdAt: '2026-06-02 09:10',
      updatedAt: '2026-06-03 08:25',
      noteCount: 2,
      tenant: 'Pilot Cloud',
    },
  ];
}
