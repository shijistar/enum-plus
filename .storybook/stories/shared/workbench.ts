import { Enum } from '../../../src';

export const TicketStatusEnum = Enum(
  {
    Draft: {
      value: 'draft',
      label: 'storybook.stories.workbenchDemo.enums.status.draft',
      badgeStatus: 'default',
      color: 'default',
      shortLabel: 'DR',
      hint: 'storybook.stories.workbenchDemo.enums.statusHint.draft',
      weight: 1,
    },
    Triage: {
      value: 'triage',
      label: 'storybook.stories.workbenchDemo.enums.status.triage',
      badgeStatus: 'processing',
      color: 'blue',
      shortLabel: 'TR',
      hint: 'storybook.stories.workbenchDemo.enums.statusHint.triage',
      weight: 2,
    },
    Blocked: {
      value: 'blocked',
      label: 'storybook.stories.workbenchDemo.enums.status.blocked',
      badgeStatus: 'error',
      color: 'red',
      shortLabel: 'BL',
      hint: 'storybook.stories.workbenchDemo.enums.statusHint.blocked',
      weight: 5,
    },
    InProgress: {
      value: 'inProgress',
      label: 'storybook.stories.workbenchDemo.enums.status.inProgress',
      badgeStatus: 'warning',
      color: 'gold',
      shortLabel: 'IP',
      hint: 'storybook.stories.workbenchDemo.enums.statusHint.inProgress',
      weight: 3,
    },
    Resolved: {
      value: 'resolved',
      label: 'storybook.stories.workbenchDemo.enums.status.resolved',
      badgeStatus: 'success',
      color: 'green',
      shortLabel: 'RS',
      hint: 'storybook.stories.workbenchDemo.enums.statusHint.resolved',
      weight: 4,
    },
  },
  { name: 'storybook.stories.workbenchDemo.enums.status.enumName' },
);

export const TicketPriorityEnum = Enum(
  {
    Critical: {
      value: 'critical',
      label: 'storybook.stories.workbenchDemo.enums.priority.critical',
      badgeStatus: 'error',
      color: 'volcano',
      shortLabel: 'P0',
      hint: 'storybook.stories.workbenchDemo.enums.priorityHint.critical',
      weight: 100,
    },
    High: {
      value: 'high',
      label: 'storybook.stories.workbenchDemo.enums.priority.high',
      badgeStatus: 'warning',
      color: 'orange',
      shortLabel: 'P1',
      hint: 'storybook.stories.workbenchDemo.enums.priorityHint.high',
      weight: 80,
    },
    Medium: {
      value: 'medium',
      label: 'storybook.stories.workbenchDemo.enums.priority.medium',
      badgeStatus: 'processing',
      color: 'blue',
      shortLabel: 'P2',
      hint: 'storybook.stories.workbenchDemo.enums.priorityHint.medium',
      weight: 50,
    },
    Low: {
      value: 'low',
      label: 'storybook.stories.workbenchDemo.enums.priority.low',
      badgeStatus: 'default',
      color: 'default',
      shortLabel: 'P3',
      hint: 'storybook.stories.workbenchDemo.enums.priorityHint.low',
      weight: 20,
    },
  },
  { name: 'storybook.stories.workbenchDemo.enums.priority.enumName' },
);

export const TicketChannelEnum = Enum(
  {
    ProductBoard: {
      value: 'productBoard',
      label: 'storybook.stories.workbenchDemo.enums.channel.productBoard',
      color: 'geekblue',
      hint: 'storybook.stories.workbenchDemo.enums.channelHint.productBoard',
    },
    VipDesk: {
      value: 'vipDesk',
      label: 'storybook.stories.workbenchDemo.enums.channel.vipDesk',
      color: 'magenta',
      hint: 'storybook.stories.workbenchDemo.enums.channelHint.vipDesk',
    },
    OpsDesk: {
      value: 'opsDesk',
      label: 'storybook.stories.workbenchDemo.enums.channel.opsDesk',
      color: 'cyan',
      hint: 'storybook.stories.workbenchDemo.enums.channelHint.opsDesk',
    },
    PartnerPortal: {
      value: 'partnerPortal',
      label: 'storybook.stories.workbenchDemo.enums.channel.partnerPortal',
      color: 'purple',
      hint: 'storybook.stories.workbenchDemo.enums.channelHint.partnerPortal',
    },
  },
  { name: 'storybook.stories.workbenchDemo.enums.channel.enumName' },
);

export const TicketOwnerEnum = Enum(
  {
    Amy: {
      value: 'amy',
      label: 'storybook.stories.workbenchDemo.enums.owner.amy',
      color: 'blue',
      hint: 'storybook.stories.workbenchDemo.enums.ownerRole.amy',
    },
    Ben: {
      value: 'ben',
      label: 'storybook.stories.workbenchDemo.enums.owner.ben',
      color: 'gold',
      hint: 'storybook.stories.workbenchDemo.enums.ownerRole.ben',
    },
    Cora: {
      value: 'cora',
      label: 'storybook.stories.workbenchDemo.enums.owner.cora',
      color: 'green',
      hint: 'storybook.stories.workbenchDemo.enums.ownerRole.cora',
    },
    Dylan: {
      value: 'dylan',
      label: 'storybook.stories.workbenchDemo.enums.owner.dylan',
      color: 'purple',
      hint: 'storybook.stories.workbenchDemo.enums.ownerRole.dylan',
    },
  },
  { name: 'storybook.stories.workbenchDemo.enums.owner.enumName' },
);

export const TicketRegionEnum = Enum(
  {
    CnNorth: {
      value: 'cnNorth',
      label: 'storybook.stories.workbenchDemo.enums.region.cnNorth',
      color: 'red',
      hint: 'storybook.stories.workbenchDemo.enums.regionHint.cnNorth',
    },
    EuWest: {
      value: 'euWest',
      label: 'storybook.stories.workbenchDemo.enums.region.euWest',
      color: 'blue',
      hint: 'storybook.stories.workbenchDemo.enums.regionHint.euWest',
    },
    UsEast: {
      value: 'usEast',
      label: 'storybook.stories.workbenchDemo.enums.region.usEast',
      color: 'green',
      hint: 'storybook.stories.workbenchDemo.enums.regionHint.usEast',
    },
  },
  { name: 'storybook.stories.workbenchDemo.enums.region.enumName' },
);

export const TicketSeverityEnum = Enum(
  {
    Sev1: {
      value: 'sev1',
      label: 'storybook.stories.workbenchDemo.enums.severity.sev1',
      color: 'volcano',
      hint: 'storybook.stories.workbenchDemo.enums.severityHint.sev1',
      weight: 90,
    },
    Sev2: {
      value: 'sev2',
      label: 'storybook.stories.workbenchDemo.enums.severity.sev2',
      color: 'orange',
      hint: 'storybook.stories.workbenchDemo.enums.severityHint.sev2',
      weight: 60,
    },
    Sev3: {
      value: 'sev3',
      label: 'storybook.stories.workbenchDemo.enums.severity.sev3',
      color: 'blue',
      hint: 'storybook.stories.workbenchDemo.enums.severityHint.sev3',
      weight: 30,
    },
  },
  { name: 'storybook.stories.workbenchDemo.enums.severity.enumName' },
);

export const TicketFlagEnum = Enum(
  {
    SlaRisk: {
      value: 'slaRisk',
      label: 'storybook.stories.workbenchDemo.enums.flag.slaRisk',
      color: 'red',
      hint: 'storybook.stories.workbenchDemo.enums.flagHint.slaRisk',
    },
    CustomerEscalated: {
      value: 'customerEscalated',
      label: 'storybook.stories.workbenchDemo.enums.flag.customerEscalated',
      color: 'gold',
      hint: 'storybook.stories.workbenchDemo.enums.flagHint.customerEscalated',
    },
    RequiresRollback: {
      value: 'requiresRollback',
      label: 'storybook.stories.workbenchDemo.enums.flag.requiresRollback',
      color: 'volcano',
      hint: 'storybook.stories.workbenchDemo.enums.flagHint.requiresRollback',
    },
    NeedsTranslation: {
      value: 'needsTranslation',
      label: 'storybook.stories.workbenchDemo.enums.flag.needsTranslation',
      color: 'cyan',
      hint: 'storybook.stories.workbenchDemo.enums.flagHint.needsTranslation',
    },
  },
  { name: 'storybook.stories.workbenchDemo.enums.flag.enumName' },
);

export const TableModeEnum = Enum(
  {
    All: {
      value: 'all',
      label: 'storybook.stories.workbenchDemo.enums.view.all',
      hint: 'storybook.stories.workbenchDemo.enums.viewHint.all',
    },
    MyOpen: {
      value: 'myOpen',
      label: 'storybook.stories.workbenchDemo.enums.view.myOpen',
      hint: 'storybook.stories.workbenchDemo.enums.viewHint.myOpen',
    },
    Risk: {
      value: 'risk',
      label: 'storybook.stories.workbenchDemo.enums.view.risk',
      hint: 'storybook.stories.workbenchDemo.enums.viewHint.risk',
    },
  },
  { name: 'storybook.stories.workbenchDemo.enums.view.enumName' },
);

export const channelOptions = TicketChannelEnum.items.map((option) => {
  const raw = TicketChannelEnum.raw(option.value);
  return {
    ...option,
    searchText: `${TicketChannelEnum.findBy('value', option.value)?.label ?? ''} ${raw?.hint ?? ''}`,
  };
});

export type TicketFormValues = {
  title: string;
  status: typeof TicketStatusEnum.valueType;
  priority: typeof TicketPriorityEnum.valueType;
  channel: typeof TicketChannelEnum.valueType;
  owner: typeof TicketOwnerEnum.valueType;
  region: typeof TicketRegionEnum.valueType;
  severity: typeof TicketSeverityEnum.valueType;
  preferredView: typeof TableModeEnum.valueType;
  flags: (typeof TicketFlagEnum.valueType)[];
};

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
      createdAt: '2026-06-02 09:10',
      updatedAt: '2026-06-03 08:25',
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
      createdAt: '2026-06-01 14:42',
      updatedAt: '2026-06-03 07:58',
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
      createdAt: '2026-06-01 10:18',
      updatedAt: '2026-06-03 09:05',
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
      createdAt: '2026-05-31 18:20',
      updatedAt: '2026-06-02 20:16',
      noteCount: 2,
      tenant: 'Pilot Cloud',
    },
  ];
}
