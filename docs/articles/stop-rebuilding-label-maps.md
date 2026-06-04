# Stop rebuilding label maps: a practical case for `enum-plus` in frontend apps

Most TypeScript enum debates focus on syntax.

Frontend teams usually have a more expensive problem: one backend status value quietly turns into labels, colors, select options, filters, localized strings, and lookup helpers across several files.

That is the problem this article is about.

If your UI keeps rebuilding the same business meaning around the same values, [`enum-plus`](https://github.com/shijistar/enum-plus) is worth a look.

## TL;DR

- Native `enum` and `as const` objects are both useful.
- Neither one gives you a built-in runtime source of truth for UI-facing metadata.
- `enum-plus` is most interesting when enum-like values need to drive labels, metadata, i18n, and UI option lists from one definition.
- If you only need constants and types, you probably do **not** need it.

## The usual frontend enum mess

A common codebase pattern looks like this:

```ts
export enum ArticleStatus {
  Draft = 0,
  Published = 1,
  Archived = 2,
}

export const articleStatusLabels: Record<ArticleStatus, string> = {
  [ArticleStatus.Draft]: 'Draft',
  [ArticleStatus.Published]: 'Published',
  [ArticleStatus.Archived]: 'Archived',
};

export const articleStatusColors: Record<ArticleStatus, string> = {
  [ArticleStatus.Draft]: 'gray',
  [ArticleStatus.Published]: 'green',
  [ArticleStatus.Archived]: 'red',
};

export const articleStatusOptions = [
  { value: ArticleStatus.Draft, label: articleStatusLabels[ArticleStatus.Draft] },
  { value: ArticleStatus.Published, label: articleStatusLabels[ArticleStatus.Published] },
  { value: ArticleStatus.Archived, label: articleStatusLabels[ArticleStatus.Archived] },
];
```

None of that code is wrong.

The problem is that one business concept now lives in multiple runtime structures, and those structures drift unless someone keeps them aligned.

## `as const` solves one problem, not all of them

A plain `as const` object is still a great default when all you need is constants plus a union type:

```ts
const ArticleStatus = {
  Draft: 0,
  Published: 1,
  Archived: 2,
} as const;

type ArticleStatus = typeof ArticleStatus[keyof typeof ArticleStatus];
```

That works well for type-level constraints.

It stops being enough when the same values also need labels, i18n, colors, option lists, reverse lookups, or extra metadata at runtime.

## Where `enum-plus` becomes useful

The most compelling use case for `enum-plus` is not "better enums."

It is having **one runtime definition** that can drive:

- application logic,
- display labels,
- localization,
- dropdowns and menus,
- table filters,
- metadata lookups,
- validation helpers.

A practical example:

```ts
import { Enum } from 'enum-plus';

const ArticleStatus = Enum({
  Draft: {
    value: 0,
    label: 'Draft',
    color: 'gray',
    icon: 'edit',
  },
  Published: {
    value: 1,
    label: 'Published',
    color: 'green',
    icon: 'check-circle',
  },
  Archived: {
    value: 2,
    label: 'Archived',
    color: 'red',
    icon: 'archive',
  },
});
```

Now one definition can drive multiple use cases:

```ts
ArticleStatus.Published;             // 1
ArticleStatus.label(1);              // 'Published'
ArticleStatus.key(1);                // 'Published'
ArticleStatus.items;                 // UI-friendly iterable items
ArticleStatus.findBy('color', 'red') // enum item lookup
ArticleStatus.named.Published.raw;   // { value: 1, label: 'Published', color: 'green', icon: 'check-circle' }
```

And if you want direct access to a metadata field:

```ts
ArticleStatus.named.Published.raw.color; // 'green'
```

That may not look dramatic at first glance, but it removes a lot of scattered glue code.

## Why this matters in real frontend code

Suppose your backend returns article rows with a numeric `status` field.

Your UI might need to:

- render a label in a table,
- render a badge color,
- create filter options,
- populate a form select,
- localize the display text.

With the usual approach, those concerns get split across separate maps and helpers.

With a runtime enum definition, they can come from one place.

That does not just save lines of code. It reduces the number of places where business vocabulary can silently diverge.

## Native `enum` vs `as const` vs `enum-plus`

| Approach | Good for constants/types | Labels + metadata in one definition | Generate UI lists from the same source | Extra maps/helpers needed |
| --- | --- | --- | --- | --- |
| native `enum` | yes | no | no | yes |
| `as const` object | yes | not by itself | not by itself | yes |
| `enum-plus` | yes | yes | yes | fewer |

So no, `enum-plus` is not the right answer for every project.

But it is a strong answer for projects where enum-like values need to drive UI and business display behavior.

## The real design question

A lot of enum discussions in TypeScript are framed around language purity:

- should we use enums at all?
- should we prefer unions?
- should we use `as const` objects instead?

Those are valid questions.

But in app development, the more practical question is often:

> Where does the runtime meaning live?

If one backend code needs to become:

- a readable label,
- a localized label,
- a select option,
- a filter option,
- a badge color,
- a searchable lookup,

then the design problem is not just typing.

It is deciding where that information lives and how many times it has to be rebuilt.

That is the gap `enum-plus` fills best.

## When not to use `enum-plus`

I would **not** use `enum-plus` if:

1. I only need a few constants and a union type.
2. I do not need runtime labels or metadata.
3. I am writing a tiny module where plain objects are simpler.
4. My team strongly prefers zero abstraction over convenience helpers.
5. I do not want another runtime dependency.
6. My team already has a stable plain-object pattern that works well.
7. My enum definitions are generated from API types and I do not want a wrapper layer.

In those cases, `as const` may be all you need.

## Why this repo is worth watching

A few things make the project more credible than a random experiment:

- active release history,
- multiple contributors,
- zero dependencies,
- migration docs,
- plugin system,
- support for frontend-oriented use cases many teams actually hit.

That combination matters more than hype.

## Final thought

I do not think the strongest pitch for `enum-plus` is:

> TypeScript enums, but better.

I think the stronger pitch is:

> One runtime source of truth for values your UI needs to display, translate, color, filter, and select.

If that matches a problem in your codebase, start here:

- Repo: https://github.com/shijistar/enum-plus
- Docs: https://shijistar.github.io/enum-plus/?path=/docs/introduce--docs
