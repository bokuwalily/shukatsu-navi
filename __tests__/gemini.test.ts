// __tests__/gemini.test.ts
import { describe, it, expect, vi } from 'vitest'
import { generateArticle } from '../lib/gemini'

vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn().mockResolvedValue({
    text: JSON.stringify({
      title: 'テスト記事タイトル',
      meta_desc: 'これはテスト用のメタディスクリプションです。就活生に役立つ情報を提供します。',
      content: '# テスト記事\n\n## 見出し2\n\nこれはテスト記事の内容です。',
      tags: ['就活', '自己PR', 'ES', '面接', '大学生'],
    }),
  })
  class MockGoogleGenAI {
    models = { generateContent: mockGenerateContent }
    constructor(_opts: unknown) {}
  }
  return { GoogleGenAI: MockGoogleGenAI }
})

describe('generateArticle', () => {
  it('キーワードから記事オブジェクトを返す', async () => {
    const result = await generateArticle('自己PR 書き方 例文', 'ES・自己PR')
    expect(result.title).toBeTruthy()
    expect(result.content).toBeTruthy()
    expect(result.meta_desc).toBeTruthy()
    expect(result.slug).toBeTruthy()
    expect(result.slug).not.toContain(' ')
    expect(result.keyword).toBe('自己PR 書き方 例文')
    expect(result.category).toBe('ES・自己PR')
    expect(Array.isArray(result.tags)).toBe(true)
    expect(result.tags.length).toBeGreaterThan(0)
  })
})
