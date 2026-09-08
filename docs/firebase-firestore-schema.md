# Firestore schema

This schema favors small documents and ID references. Each Firestore document
ID is the primary identifier (`userId`, `matchId`, and so on), so it is not
stored a second time in the document body.

## `roles/{roleId}`

```ts
{
  name: "admin" | "editor" | "member",
  permissions: string[]
}
```

Start with `admin`, `editor`, and `member`. Permission keys can be simple
values such as `"matches.write"` or `"albums.write"`.

## `users/{userId}`

```ts
{
  firstName: string,
  lastName: string,
  avatarUrl: string | null,
  accessCodeHash: string,
  roleId: string,
  isActive: boolean,
  createdAt: Timestamp
}
```

`userId` should be the Firebase Auth UID once authentication is enabled.
Each user access code is a six-digit PIN (`/^\\d{6}$/`). Never store that PIN in
plain text: validate it at sign-in and store only `accessCodeHash`.

## `teams/{teamId}`

```ts
{
  name: string,
  logoUrl: string
}
```

For SofaScore imports, `teamId` is its team ID and `logoUrl` uses
`https://img.sofascore.com/api/v1/team/{teamId}/image`.

## `leagues/{leagueId}`

```ts
{
  name: string,
  country: string,
  logoUrl: string
}
```

For SofaScore imports, `leagueId` is the `uniqueTournament.id` and `logoUrl`
uses `https://img.sofascore.com/api/v1/unique-tournament/{leagueId}/image`.

## `matches/{matchId}`

```ts
{
  homeTeamId: string,
  awayTeamId: string,
  leagueId: string,
  kickoffAt: Timestamp,
  homeScore: number | null,
  awayScore: number | null,
  status: "scheduled" | "live" | "finished" | "postponed" | "cancelled"
}
```

The IDs point to `teams` and `leagues`. Team names and league names are not
copied into every match; the landing joins the small set of referenced records
when rendering a match card.

## `contactSubmissions/{submissionId}`

```ts
{
  name: string,
  email: string,
  message: string,
  consentAt: Timestamp,
  status: "new" | "read" | "replied" | "archived",
  createdAt: Timestamp
}
```

This collection is server-only. It must not be readable or writable from the
browser.

## `members/{memberId}`

```ts
{
  userId: string | null,
  roleId: string | null,
  quote: string | null,
  isFeatured: boolean,
  sortOrder: number
}
```

When `userId` exists, the name and avatar come from `users/{userId}`. A
non-user public member can leave it as `null` until an account is created.

## `testimonials/{testimonialId}`

```ts
{
  memberId: string | null,
  authorName: string,
  avatarUrl: string | null,
  content: string,
  isPublished: boolean,
  createdAt: Timestamp
}
```

`memberId` connects a testimonial to a public member profile when applicable.
`authorName` supports a testimonial from a visitor who is not a registered
member.

## `albums/{albumId}`

```ts
{
  title: string,
  description: string | null,
  coverUrl: string | null,
  isPublished: boolean,
  publishedAt: Timestamp | null,
  createdAt: Timestamp
}
```

Photos are a subcollection because an album can grow without making the album
document large:

## `albums/{albumId}/photos/{photoId}`

```ts
{
  imageUrl: string,
  altText: string | null,
  sortOrder: number,
  capturedAt: Timestamp | null,
  createdAt: Timestamp
}
```

## Required indexes later

Create composite indexes only when Firestore asks for them in the console:

- `matches`: `isPublished ASC`, `kickoffAt DESC`
- `testimonials`: `isPublished ASC`, `createdAt DESC`
- `albums`: `isPublished ASC`, `publishedAt DESC`

Write operations are reserved for the future admin panel through Firebase
Admin.
