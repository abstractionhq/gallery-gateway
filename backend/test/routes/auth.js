import request from 'supertest'
import server from '../../server'
import db from '../../config/sequelize'
import User from '../../models/user'
import nconf from '../../config'
import { expect } from 'chai'
import { fakeUser } from '../factories'
import { decodeUserToken } from '../util'


describe('Authentication', () => {
  beforeEach(function (done) {
    db.sync({force: true}).then(() => {
      User
        .destroy({where: {}})
        .then(() => done())
    })
  })

  afterEach(function (done) {
    User
      .destroy({where: {}})
      .then(() => done())
  })

  describe('/auth/login', () => {
    it('redirects logged-out users to SAML endpoint', (done) => {
      request(server)
        .get('/auth/login')
        .expect((res) => {
          expect(res.headers).to.have.property('location')
          expect(
            res.headers.location.indexOf(nconf.get('auth:saml:entryPoint'))
          ).to.eq(0)
          expect(res.status).to.eq(302)
        })
        .end(done)
    })
  })

  describe('/auth/login/callback', () => {
    it('rejects invalid post bodies', (done) => {
      request(server)
        .post('/auth/login/callback')
        .expect((res) => {
          expect(res.headers).to.have.property('location')
          expect(
            res.headers.location.indexOf(nconf.get('auth:saml:entryPoint'))
          ).to.eq(0)
          expect(res.status).to.eq(302)
        })
        .end(done)
    })

    it('creates a new user when none exists', (done) => {
      request(server)
        .post('/auth/login/callback')
        .send({SAMLResponse: 'PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6cHJvdG9jb2wiIHhtbG5zOnNhbWw9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIElEPSJfNmIxZWIxNGUxOTg3NWRjMGQ2YmRmZjg0Y2U1OTMxODVlYTIyNzY4ODA3IiBWZXJzaW9uPSIyLjAiIElzc3VlSW5zdGFudD0iMjAxNy0xMS0wNlQyMToyMzowNFoiIERlc3RpbmF0aW9uPSJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXV0aC9sb2dpbi9jYWxsYmFjayIgSW5SZXNwb25zZVRvPSJfYTcyMWU4MjRiZjkzMjllZmI1NGYiPjxzYW1sOklzc3Vlcj5odHRwOi8vbG9jYWxob3N0OjgwODAvc2ltcGxlc2FtbC9zYW1sMi9pZHAvbWV0YWRhdGEucGhwPC9zYW1sOklzc3Vlcj48ZHM6U2lnbmF0dXJlIHhtbG5zOmRzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIj4KICA8ZHM6U2lnbmVkSW5mbz48ZHM6Q2Fub25pY2FsaXphdGlvbk1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPgogICAgPGRzOlNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNyc2Etc2hhMSIvPgogIDxkczpSZWZlcmVuY2UgVVJJPSIjXzZiMWViMTRlMTk4NzVkYzBkNmJkZmY4NGNlNTkzMTg1ZWEyMjc2ODgwNyI+PGRzOlRyYW5zZm9ybXM+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNlbnZlbG9wZWQtc2lnbmF0dXJlIi8+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPjwvZHM6VHJhbnNmb3Jtcz48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3NoYTEiLz48ZHM6RGlnZXN0VmFsdWU+ZXhuT3prZkJZMWE1ZkpXZ0laQ0dNMFRqYzJ3PTwvZHM6RGlnZXN0VmFsdWU+PC9kczpSZWZlcmVuY2U+PC9kczpTaWduZWRJbmZvPjxkczpTaWduYXR1cmVWYWx1ZT5yZmhDQ25wVlFHc2dKMWd1THVKcjM2RGsyTHRibkoxVXNXS0c1RzF6dU9kQ0lLQk8wKzlSaGJTNGNFL3FyY2ZBNjVIYUU1MGQ4TFRFSUtQSXgrZk9MeHZ6bjlCWUppSkRINVExay9hZWRzUUFFNnF4QlVCSVBKNW1SaExvbG96Tjl5MlBHbU9XZDZmVjV0TDRsNHg4UkRoSlVOamlld1l5dzdkVy9FYkpqWUswMnBUUGtmSjYzSVRGaDBFd1JYTlpjbE5JNFM2L1pSVVNWbHpwYWt1Q0lLcHppdjdMTC9rdEFxOTBGVi9tM2hGaWRaMXFSK1hRUThhWTBSdGsrNC9vL0ZoQTRZZEdjY2EzRlNEYndHUWpYbnBSd1kvSktHWHBQNzdJK3VmQ0xGSzRQaElCYU5wQXNzczFUL3lSZWxFakJ0ei9meHlRTjdWMW1FMWI2eEdMRWc9PTwvZHM6U2lnbmF0dXJlVmFsdWU+CjxkczpLZXlJbmZvPjxkczpYNTA5RGF0YT48ZHM6WDUwOUNlcnRpZmljYXRlPk1JSURYVENDQWtXZ0F3SUJBZ0lKQUxtVlZ1RFd1NE5ZTUEwR0NTcUdTSWIzRFFFQkN3VUFNRVV4Q3pBSkJnTlZCQVlUQWtGVk1STXdFUVlEVlFRSURBcFRiMjFsTFZOMFlYUmxNU0V3SHdZRFZRUUtEQmhKYm5SbGNtNWxkQ0JYYVdSbmFYUnpJRkIwZVNCTWRHUXdIaGNOTVRZeE1qTXhNVFF6TkRRM1doY05ORGd3TmpJMU1UUXpORFEzV2pCRk1Rc3dDUVlEVlFRR0V3SkJWVEVUTUJFR0ExVUVDQXdLVTI5dFpTMVRkR0YwWlRFaE1COEdBMVVFQ2d3WVNXNTBaWEp1WlhRZ1YybGtaMmwwY3lCUWRIa2dUSFJrTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF6VUNGb3pnTmIxaDFNMGp6TlJTQ2poT0JuUit1VmJWcGFXZlhZSVIrQWhXRGRFZTVyeVkrQ2dhdk9nOGJmTHlieXpGZGVobFlkRFJna2VkRUIvR2pHOGFKdzA2bDBxRjRqRE9BdzBrRXlnV0N1Mm1jSDdYT3hSdCtZQUgzVFZIYS9IdTFXM1dqemtvYnFxcUxROGdrS1dXTTI3Zk9nQVo2R2llYUpCTjZWQlNNTWNQZXkzSFdMQm1jK1RZSm12MWRiYU8yakhoS2g4cGZLdzBXMTJWTThQMVBJTzhndjRQaHUvdXVKWWllQldLaXhCRXl5MGxIanlpeFlGQ1IxMnhkaDRDQTQ3cTk1OFpSR25uRFVHRlZFMVFoZ1JhY0pDT1o5YmQ1dDltcjhLTGFWQllUQ0pvNUVSRThqeW1hYjVkUHFlNXFLZkpzQ1ppcVdnbGJqVW85dHdJREFRQUJvMUF3VGpBZEJnTlZIUTRFRmdRVXhwdXdjcy9DWVFPeXVpK3IxRyszS3hCTmh4a3dId1lEVlIwakJCZ3dGb0FVeHB1d2NzL0NZUU95dWkrcjFHKzNLeEJOaHhrd0RBWURWUjBUQkFVd0F3RUIvekFOQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBQWlXVUtzLzJ4L3ZpTkNLaTNZNmJsRXVDdEFHaHpPT1o5RWpydko4K0NPSDNSYWczdFZCV3JjQlozL3VoaFBxNWd5OWxxdzRPa3ZFd3M5OS81akZzWDFGSjZNS0JncWZ1eTd5aDVzMVlmTTBBTkhZY3pNbVlwWmVBY1FmMkNHQWFWZndUVGZTbHpOTHNGMmxXL2x5N3lhcEZ6bFlTSkxHb1ZFK09IRXU4ZzVTbE5BQ1VFZmtYdys1RWdoaCtLemxJTjdSNlE3cjJpeFdORkJDL2pXZjdOS1VmSnlYOHFJRzVtZDFZVWVUNkdCVzlCbTIvMS9SaU8yNEpUYVlsZkxkS0s5VFliOHNHNUIrT0xhYjJESW1HOTlDSjI1UmtBY1NvYldORjV6RDBPNmxnT28zY0VkQi9rc0NxM2htdGxDL0RsTFovRDhDSis3VnVablMxclIybmFRPT08L2RzOlg1MDlDZXJ0aWZpY2F0ZT48L2RzOlg1MDlEYXRhPjwvZHM6S2V5SW5mbz48L2RzOlNpZ25hdHVyZT48c2FtbHA6U3RhdHVzPjxzYW1scDpTdGF0dXNDb2RlIFZhbHVlPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6c3RhdHVzOlN1Y2Nlc3MiLz48L3NhbWxwOlN0YXR1cz48c2FtbDpBc3NlcnRpb24geG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiBJRD0iX2Q1NzdjMDBiYzEwN2IyZTZlODQxM2VlNzEzOTUxNGQxYTE4NTUwZTNlYyIgVmVyc2lvbj0iMi4wIiBJc3N1ZUluc3RhbnQ9IjIwMTctMTEtMDZUMjE6MjM6MDRaIj48c2FtbDpJc3N1ZXI+aHR0cDovL2xvY2FsaG9zdDo4MDgwL3NpbXBsZXNhbWwvc2FtbDIvaWRwL21ldGFkYXRhLnBocDwvc2FtbDpJc3N1ZXI+PGRzOlNpZ25hdHVyZSB4bWxuczpkcz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnIyI+CiAgPGRzOlNpZ25lZEluZm8+PGRzOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz4KICAgIDxkczpTaWduYXR1cmVNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjcnNhLXNoYTEiLz4KICA8ZHM6UmVmZXJlbmNlIFVSST0iI19kNTc3YzAwYmMxMDdiMmU2ZTg0MTNlZTcxMzk1MTRkMWExODU1MGUzZWMiPjxkczpUcmFuc2Zvcm1zPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIvPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48L2RzOlRyYW5zZm9ybXM+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNzaGExIi8+PGRzOkRpZ2VzdFZhbHVlPlFIVVRNclhITzRsRzEwNFkyV3NIS1FhU01SZz08L2RzOkRpZ2VzdFZhbHVlPjwvZHM6UmVmZXJlbmNlPjwvZHM6U2lnbmVkSW5mbz48ZHM6U2lnbmF0dXJlVmFsdWU+R1N5S1RNWTN4dGtTaS9NRW82U1BLaVNCVUlIK2FSUlU3M0xWamNadUhqUGI5QXErOTVnNnJtSHE5YTROWGpRUVA5WExmcThNZjFTK01JZ2h5aDNtd094YlpsZG43S2kvVUpFUHpHaW93K0tTVFgvbld3bGpkYVFXcnJZTXNtN3VWcDZHbFQxRDZXa3RuVTl4Rk8vOXJHRnhQbTNGenhkMWdBYUxpRzY3dTE5cHRzR3JZWGhjZW9NMFZjR0N5VzE4bVZBOHRpSlBNblQxeGlMNmhqVHdtK0NKbnk4VWlNNC9UOUcvakcvOC9maHRUdjZWMjhZUHlYVklyQmJCNDhRTFc1NCtITHdxWnF4UzMxMnJWUW5JbmhLQ0U5T0ZHU3o4cE85WFZvdlIvMm5ZMFZaaVlXWFZ1YUJ0enRCU25jUFR1ZmY2QUo2VFg4RnhwemwrMFZrSTVRPT08L2RzOlNpZ25hdHVyZVZhbHVlPgo8ZHM6S2V5SW5mbz48ZHM6WDUwOURhdGE+PGRzOlg1MDlDZXJ0aWZpY2F0ZT5NSUlEWFRDQ0FrV2dBd0lCQWdJSkFMbVZWdURXdTROWU1BMEdDU3FHU0liM0RRRUJDd1VBTUVVeEN6QUpCZ05WQkFZVEFrRlZNUk13RVFZRFZRUUlEQXBUYjIxbExWTjBZWFJsTVNFd0h3WURWUVFLREJoSmJuUmxjbTVsZENCWGFXUm5hWFJ6SUZCMGVTQk1kR1F3SGhjTk1UWXhNak14TVRRek5EUTNXaGNOTkRnd05qSTFNVFF6TkRRM1dqQkZNUXN3Q1FZRFZRUUdFd0pCVlRFVE1CRUdBMVVFQ0F3S1UyOXRaUzFUZEdGMFpURWhNQjhHQTFVRUNnd1lTVzUwWlhKdVpYUWdWMmxrWjJsMGN5QlFkSGtnVEhSa01JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBelVDRm96Z05iMWgxTTBqek5SU0NqaE9CblIrdVZiVnBhV2ZYWUlSK0FoV0RkRWU1cnlZK0NnYXZPZzhiZkx5Ynl6RmRlaGxZZERSZ2tlZEVCL0dqRzhhSncwNmwwcUY0akRPQXcwa0V5Z1dDdTJtY0g3WE94UnQrWUFIM1RWSGEvSHUxVzNXanprb2JxcXFMUThna0tXV00yN2ZPZ0FaNkdpZWFKQk42VkJTTU1jUGV5M0hXTEJtYytUWUptdjFkYmFPMmpIaEtoOHBmS3cwVzEyVk04UDFQSU84Z3Y0UGh1L3V1SllpZUJXS2l4QkV5eTBsSGp5aXhZRkNSMTJ4ZGg0Q0E0N3E5NThaUkdubkRVR0ZWRTFRaGdSYWNKQ09aOWJkNXQ5bXI4S0xhVkJZVENKbzVFUkU4anltYWI1ZFBxZTVxS2ZKc0NaaXFXZ2xialVvOXR3SURBUUFCbzFBd1RqQWRCZ05WSFE0RUZnUVV4cHV3Y3MvQ1lRT3l1aStyMUcrM0t4Qk5oeGt3SHdZRFZSMGpCQmd3Rm9BVXhwdXdjcy9DWVFPeXVpK3IxRyszS3hCTmh4a3dEQVlEVlIwVEJBVXdBd0VCL3pBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQUFpV1VLcy8yeC92aU5DS2kzWTZibEV1Q3RBR2h6T09aOUVqcnZKOCtDT0gzUmFnM3RWQldyY0JaMy91aGhQcTVneTlscXc0T2t2RXdzOTkvNWpGc1gxRko2TUtCZ3FmdXk3eWg1czFZZk0wQU5IWWN6TW1ZcFplQWNRZjJDR0FhVmZ3VFRmU2x6TkxzRjJsVy9seTd5YXBGemxZU0pMR29WRStPSEV1OGc1U2xOQUNVRWZrWHcrNUVnaGgrS3psSU43UjZRN3IyaXhXTkZCQy9qV2Y3TktVZkp5WDhxSUc1bWQxWVVlVDZHQlc5Qm0yLzEvUmlPMjRKVGFZbGZMZEtLOVRZYjhzRzVCK09MYWIyREltRzk5Q0oyNVJrQWNTb2JXTkY1ekQwTzZsZ09vM2NFZEIva3NDcTNobXRsQy9EbExaL0Q4Q0orN1Z1Wm5TMXJSMm5hUT09PC9kczpYNTA5Q2VydGlmaWNhdGU+PC9kczpYNTA5RGF0YT48L2RzOktleUluZm8+PC9kczpTaWduYXR1cmU+PHNhbWw6U3ViamVjdD48c2FtbDpOYW1lSUQgU1BOYW1lUXVhbGlmaWVyPSJodHRwOi8vYXBwLmV4YW1wbGUuY29tIiBGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpuYW1laWQtZm9ybWF0OnRyYW5zaWVudCI+XzVkN2Q2Mjg5YjA0MGIwZDM5MmMxZDhlM2YzNTI3ZTk4YzBjM2I0ZDI3ZTwvc2FtbDpOYW1lSUQ+PHNhbWw6U3ViamVjdENvbmZpcm1hdGlvbiBNZXRob2Q9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpjbTpiZWFyZXIiPjxzYW1sOlN1YmplY3RDb25maXJtYXRpb25EYXRhIE5vdE9uT3JBZnRlcj0iMjMzNC0wOS0yN1QxNTowOTo0NFoiIFJlY2lwaWVudD0iaHR0cDovL2xvY2FsaG9zdDozMDAwL2F1dGgvbG9naW4vY2FsbGJhY2siIEluUmVzcG9uc2VUbz0iX2E3MjFlODI0YmY5MzI5ZWZiNTRmIi8+PC9zYW1sOlN1YmplY3RDb25maXJtYXRpb24+PC9zYW1sOlN1YmplY3Q+PHNhbWw6Q29uZGl0aW9ucyBOb3RCZWZvcmU9IjIwMTctMTEtMDZUMjE6MjI6MzRaIiBOb3RPbk9yQWZ0ZXI9IjIzMzQtMDktMjdUMTU6MDk6NDRaIj48c2FtbDpBdWRpZW5jZVJlc3RyaWN0aW9uPjxzYW1sOkF1ZGllbmNlPmh0dHA6Ly9hcHAuZXhhbXBsZS5jb208L3NhbWw6QXVkaWVuY2U+PC9zYW1sOkF1ZGllbmNlUmVzdHJpY3Rpb24+PC9zYW1sOkNvbmRpdGlvbnM+PHNhbWw6QXV0aG5TdGF0ZW1lbnQgQXV0aG5JbnN0YW50PSIyMDE3LTExLTA2VDE4OjQwOjQwWiIgU2Vzc2lvbk5vdE9uT3JBZnRlcj0iMjAxNy0xMS0wN1QwMjo0MDo0MFoiIFNlc3Npb25JbmRleD0iXzgzZTMyYzg3MGQ4MTYxNzg5OWUzY2I2YmVmNjg1MzRlZWRjYmE1MGQyYiI+PHNhbWw6QXV0aG5Db250ZXh0PjxzYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPnVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlBhc3N3b3JkPC9zYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPjwvc2FtbDpBdXRobkNvbnRleHQ+PC9zYW1sOkF1dGhuU3RhdGVtZW50PjxzYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48c2FtbDpBdHRyaWJ1dGUgTmFtZT0idWlkIiBOYW1lRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXR0cm5hbWUtZm9ybWF0OmJhc2ljIj48c2FtbDpBdHRyaWJ1dGVWYWx1ZSB4c2k6dHlwZT0ieHM6c3RyaW5nIj4xPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjwvc2FtbDpBdHRyaWJ1dGU+PHNhbWw6QXR0cmlidXRlIE5hbWU9ImVkdVBlcnNvbkFmZmlsaWF0aW9uIiBOYW1lRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXR0cm5hbWUtZm9ybWF0OmJhc2ljIj48c2FtbDpBdHRyaWJ1dGVWYWx1ZSB4c2k6dHlwZT0ieHM6c3RyaW5nIj5ncm91cDE8L3NhbWw6QXR0cmlidXRlVmFsdWU+PC9zYW1sOkF0dHJpYnV0ZT48c2FtbDpBdHRyaWJ1dGUgTmFtZT0iZW1haWwiIE5hbWVGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphdHRybmFtZS1mb3JtYXQ6YmFzaWMiPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhzaTp0eXBlPSJ4czpzdHJpbmciPnVzZXIxQGV4YW1wbGUuY29tPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjwvc2FtbDpBdHRyaWJ1dGU+PC9zYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48L3NhbWw6QXNzZXJ0aW9uPjwvc2FtbHA6UmVzcG9uc2U+'})
        .expect((res) => {
          expect(
            res.headers.location.indexOf(nconf.get('auth:saml:finalUrl'))
          ).to.eq(0)
          expect(res.headers).to.have.property('set-cookie')
          expect(res.headers['set-cookie'].indexOf('_token_v1')).to.be.gte(0)
        })
        .end(() => {
          // should have made 'user1'
          User.findOne({where: {username: 'user1'}})
            .then((user) => {
              expect(user.username).to.eq('user1')
              expect(user.id).to.be.gte(0)
              expect(user.type).to.eq('STUDENT')
              done()
            })
        })
    })

    it('uses the existing user when one exists', (done) => {
      fakeUser({username: 'user1', type: 'ADMIN'})
        .then((user) => {
          request(server)
            .post('/auth/login/callback')
            .send({SAMLResponse: 'PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6cHJvdG9jb2wiIHhtbG5zOnNhbWw9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphc3NlcnRpb24iIElEPSJfNmIxZWIxNGUxOTg3NWRjMGQ2YmRmZjg0Y2U1OTMxODVlYTIyNzY4ODA3IiBWZXJzaW9uPSIyLjAiIElzc3VlSW5zdGFudD0iMjAxNy0xMS0wNlQyMToyMzowNFoiIERlc3RpbmF0aW9uPSJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXV0aC9sb2dpbi9jYWxsYmFjayIgSW5SZXNwb25zZVRvPSJfYTcyMWU4MjRiZjkzMjllZmI1NGYiPjxzYW1sOklzc3Vlcj5odHRwOi8vbG9jYWxob3N0OjgwODAvc2ltcGxlc2FtbC9zYW1sMi9pZHAvbWV0YWRhdGEucGhwPC9zYW1sOklzc3Vlcj48ZHM6U2lnbmF0dXJlIHhtbG5zOmRzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIj4KICA8ZHM6U2lnbmVkSW5mbz48ZHM6Q2Fub25pY2FsaXphdGlvbk1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPgogICAgPGRzOlNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNyc2Etc2hhMSIvPgogIDxkczpSZWZlcmVuY2UgVVJJPSIjXzZiMWViMTRlMTk4NzVkYzBkNmJkZmY4NGNlNTkzMTg1ZWEyMjc2ODgwNyI+PGRzOlRyYW5zZm9ybXM+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNlbnZlbG9wZWQtc2lnbmF0dXJlIi8+PGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMTAveG1sLWV4Yy1jMTRuIyIvPjwvZHM6VHJhbnNmb3Jtcz48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3NoYTEiLz48ZHM6RGlnZXN0VmFsdWU+ZXhuT3prZkJZMWE1ZkpXZ0laQ0dNMFRqYzJ3PTwvZHM6RGlnZXN0VmFsdWU+PC9kczpSZWZlcmVuY2U+PC9kczpTaWduZWRJbmZvPjxkczpTaWduYXR1cmVWYWx1ZT5yZmhDQ25wVlFHc2dKMWd1THVKcjM2RGsyTHRibkoxVXNXS0c1RzF6dU9kQ0lLQk8wKzlSaGJTNGNFL3FyY2ZBNjVIYUU1MGQ4TFRFSUtQSXgrZk9MeHZ6bjlCWUppSkRINVExay9hZWRzUUFFNnF4QlVCSVBKNW1SaExvbG96Tjl5MlBHbU9XZDZmVjV0TDRsNHg4UkRoSlVOamlld1l5dzdkVy9FYkpqWUswMnBUUGtmSjYzSVRGaDBFd1JYTlpjbE5JNFM2L1pSVVNWbHpwYWt1Q0lLcHppdjdMTC9rdEFxOTBGVi9tM2hGaWRaMXFSK1hRUThhWTBSdGsrNC9vL0ZoQTRZZEdjY2EzRlNEYndHUWpYbnBSd1kvSktHWHBQNzdJK3VmQ0xGSzRQaElCYU5wQXNzczFUL3lSZWxFakJ0ei9meHlRTjdWMW1FMWI2eEdMRWc9PTwvZHM6U2lnbmF0dXJlVmFsdWU+CjxkczpLZXlJbmZvPjxkczpYNTA5RGF0YT48ZHM6WDUwOUNlcnRpZmljYXRlPk1JSURYVENDQWtXZ0F3SUJBZ0lKQUxtVlZ1RFd1NE5ZTUEwR0NTcUdTSWIzRFFFQkN3VUFNRVV4Q3pBSkJnTlZCQVlUQWtGVk1STXdFUVlEVlFRSURBcFRiMjFsTFZOMFlYUmxNU0V3SHdZRFZRUUtEQmhKYm5SbGNtNWxkQ0JYYVdSbmFYUnpJRkIwZVNCTWRHUXdIaGNOTVRZeE1qTXhNVFF6TkRRM1doY05ORGd3TmpJMU1UUXpORFEzV2pCRk1Rc3dDUVlEVlFRR0V3SkJWVEVUTUJFR0ExVUVDQXdLVTI5dFpTMVRkR0YwWlRFaE1COEdBMVVFQ2d3WVNXNTBaWEp1WlhRZ1YybGtaMmwwY3lCUWRIa2dUSFJrTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF6VUNGb3pnTmIxaDFNMGp6TlJTQ2poT0JuUit1VmJWcGFXZlhZSVIrQWhXRGRFZTVyeVkrQ2dhdk9nOGJmTHlieXpGZGVobFlkRFJna2VkRUIvR2pHOGFKdzA2bDBxRjRqRE9BdzBrRXlnV0N1Mm1jSDdYT3hSdCtZQUgzVFZIYS9IdTFXM1dqemtvYnFxcUxROGdrS1dXTTI3Zk9nQVo2R2llYUpCTjZWQlNNTWNQZXkzSFdMQm1jK1RZSm12MWRiYU8yakhoS2g4cGZLdzBXMTJWTThQMVBJTzhndjRQaHUvdXVKWWllQldLaXhCRXl5MGxIanlpeFlGQ1IxMnhkaDRDQTQ3cTk1OFpSR25uRFVHRlZFMVFoZ1JhY0pDT1o5YmQ1dDltcjhLTGFWQllUQ0pvNUVSRThqeW1hYjVkUHFlNXFLZkpzQ1ppcVdnbGJqVW85dHdJREFRQUJvMUF3VGpBZEJnTlZIUTRFRmdRVXhwdXdjcy9DWVFPeXVpK3IxRyszS3hCTmh4a3dId1lEVlIwakJCZ3dGb0FVeHB1d2NzL0NZUU95dWkrcjFHKzNLeEJOaHhrd0RBWURWUjBUQkFVd0F3RUIvekFOQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBQWlXVUtzLzJ4L3ZpTkNLaTNZNmJsRXVDdEFHaHpPT1o5RWpydko4K0NPSDNSYWczdFZCV3JjQlozL3VoaFBxNWd5OWxxdzRPa3ZFd3M5OS81akZzWDFGSjZNS0JncWZ1eTd5aDVzMVlmTTBBTkhZY3pNbVlwWmVBY1FmMkNHQWFWZndUVGZTbHpOTHNGMmxXL2x5N3lhcEZ6bFlTSkxHb1ZFK09IRXU4ZzVTbE5BQ1VFZmtYdys1RWdoaCtLemxJTjdSNlE3cjJpeFdORkJDL2pXZjdOS1VmSnlYOHFJRzVtZDFZVWVUNkdCVzlCbTIvMS9SaU8yNEpUYVlsZkxkS0s5VFliOHNHNUIrT0xhYjJESW1HOTlDSjI1UmtBY1NvYldORjV6RDBPNmxnT28zY0VkQi9rc0NxM2htdGxDL0RsTFovRDhDSis3VnVablMxclIybmFRPT08L2RzOlg1MDlDZXJ0aWZpY2F0ZT48L2RzOlg1MDlEYXRhPjwvZHM6S2V5SW5mbz48L2RzOlNpZ25hdHVyZT48c2FtbHA6U3RhdHVzPjxzYW1scDpTdGF0dXNDb2RlIFZhbHVlPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6c3RhdHVzOlN1Y2Nlc3MiLz48L3NhbWxwOlN0YXR1cz48c2FtbDpBc3NlcnRpb24geG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiBJRD0iX2Q1NzdjMDBiYzEwN2IyZTZlODQxM2VlNzEzOTUxNGQxYTE4NTUwZTNlYyIgVmVyc2lvbj0iMi4wIiBJc3N1ZUluc3RhbnQ9IjIwMTctMTEtMDZUMjE6MjM6MDRaIj48c2FtbDpJc3N1ZXI+aHR0cDovL2xvY2FsaG9zdDo4MDgwL3NpbXBsZXNhbWwvc2FtbDIvaWRwL21ldGFkYXRhLnBocDwvc2FtbDpJc3N1ZXI+PGRzOlNpZ25hdHVyZSB4bWxuczpkcz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnIyI+CiAgPGRzOlNpZ25lZEluZm8+PGRzOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz4KICAgIDxkczpTaWduYXR1cmVNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjcnNhLXNoYTEiLz4KICA8ZHM6UmVmZXJlbmNlIFVSST0iI19kNTc3YzAwYmMxMDdiMmU2ZTg0MTNlZTcxMzk1MTRkMWExODU1MGUzZWMiPjxkczpUcmFuc2Zvcm1zPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIvPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz48L2RzOlRyYW5zZm9ybXM+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNzaGExIi8+PGRzOkRpZ2VzdFZhbHVlPlFIVVRNclhITzRsRzEwNFkyV3NIS1FhU01SZz08L2RzOkRpZ2VzdFZhbHVlPjwvZHM6UmVmZXJlbmNlPjwvZHM6U2lnbmVkSW5mbz48ZHM6U2lnbmF0dXJlVmFsdWU+R1N5S1RNWTN4dGtTaS9NRW82U1BLaVNCVUlIK2FSUlU3M0xWamNadUhqUGI5QXErOTVnNnJtSHE5YTROWGpRUVA5WExmcThNZjFTK01JZ2h5aDNtd094YlpsZG43S2kvVUpFUHpHaW93K0tTVFgvbld3bGpkYVFXcnJZTXNtN3VWcDZHbFQxRDZXa3RuVTl4Rk8vOXJHRnhQbTNGenhkMWdBYUxpRzY3dTE5cHRzR3JZWGhjZW9NMFZjR0N5VzE4bVZBOHRpSlBNblQxeGlMNmhqVHdtK0NKbnk4VWlNNC9UOUcvakcvOC9maHRUdjZWMjhZUHlYVklyQmJCNDhRTFc1NCtITHdxWnF4UzMxMnJWUW5JbmhLQ0U5T0ZHU3o4cE85WFZvdlIvMm5ZMFZaaVlXWFZ1YUJ0enRCU25jUFR1ZmY2QUo2VFg4RnhwemwrMFZrSTVRPT08L2RzOlNpZ25hdHVyZVZhbHVlPgo8ZHM6S2V5SW5mbz48ZHM6WDUwOURhdGE+PGRzOlg1MDlDZXJ0aWZpY2F0ZT5NSUlEWFRDQ0FrV2dBd0lCQWdJSkFMbVZWdURXdTROWU1BMEdDU3FHU0liM0RRRUJDd1VBTUVVeEN6QUpCZ05WQkFZVEFrRlZNUk13RVFZRFZRUUlEQXBUYjIxbExWTjBZWFJsTVNFd0h3WURWUVFLREJoSmJuUmxjbTVsZENCWGFXUm5hWFJ6SUZCMGVTQk1kR1F3SGhjTk1UWXhNak14TVRRek5EUTNXaGNOTkRnd05qSTFNVFF6TkRRM1dqQkZNUXN3Q1FZRFZRUUdFd0pCVlRFVE1CRUdBMVVFQ0F3S1UyOXRaUzFUZEdGMFpURWhNQjhHQTFVRUNnd1lTVzUwWlhKdVpYUWdWMmxrWjJsMGN5QlFkSGtnVEhSa01JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBelVDRm96Z05iMWgxTTBqek5SU0NqaE9CblIrdVZiVnBhV2ZYWUlSK0FoV0RkRWU1cnlZK0NnYXZPZzhiZkx5Ynl6RmRlaGxZZERSZ2tlZEVCL0dqRzhhSncwNmwwcUY0akRPQXcwa0V5Z1dDdTJtY0g3WE94UnQrWUFIM1RWSGEvSHUxVzNXanprb2JxcXFMUThna0tXV00yN2ZPZ0FaNkdpZWFKQk42VkJTTU1jUGV5M0hXTEJtYytUWUptdjFkYmFPMmpIaEtoOHBmS3cwVzEyVk04UDFQSU84Z3Y0UGh1L3V1SllpZUJXS2l4QkV5eTBsSGp5aXhZRkNSMTJ4ZGg0Q0E0N3E5NThaUkdubkRVR0ZWRTFRaGdSYWNKQ09aOWJkNXQ5bXI4S0xhVkJZVENKbzVFUkU4anltYWI1ZFBxZTVxS2ZKc0NaaXFXZ2xialVvOXR3SURBUUFCbzFBd1RqQWRCZ05WSFE0RUZnUVV4cHV3Y3MvQ1lRT3l1aStyMUcrM0t4Qk5oeGt3SHdZRFZSMGpCQmd3Rm9BVXhwdXdjcy9DWVFPeXVpK3IxRyszS3hCTmh4a3dEQVlEVlIwVEJBVXdBd0VCL3pBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQUFpV1VLcy8yeC92aU5DS2kzWTZibEV1Q3RBR2h6T09aOUVqcnZKOCtDT0gzUmFnM3RWQldyY0JaMy91aGhQcTVneTlscXc0T2t2RXdzOTkvNWpGc1gxRko2TUtCZ3FmdXk3eWg1czFZZk0wQU5IWWN6TW1ZcFplQWNRZjJDR0FhVmZ3VFRmU2x6TkxzRjJsVy9seTd5YXBGemxZU0pMR29WRStPSEV1OGc1U2xOQUNVRWZrWHcrNUVnaGgrS3psSU43UjZRN3IyaXhXTkZCQy9qV2Y3TktVZkp5WDhxSUc1bWQxWVVlVDZHQlc5Qm0yLzEvUmlPMjRKVGFZbGZMZEtLOVRZYjhzRzVCK09MYWIyREltRzk5Q0oyNVJrQWNTb2JXTkY1ekQwTzZsZ09vM2NFZEIva3NDcTNobXRsQy9EbExaL0Q4Q0orN1Z1Wm5TMXJSMm5hUT09PC9kczpYNTA5Q2VydGlmaWNhdGU+PC9kczpYNTA5RGF0YT48L2RzOktleUluZm8+PC9kczpTaWduYXR1cmU+PHNhbWw6U3ViamVjdD48c2FtbDpOYW1lSUQgU1BOYW1lUXVhbGlmaWVyPSJodHRwOi8vYXBwLmV4YW1wbGUuY29tIiBGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpuYW1laWQtZm9ybWF0OnRyYW5zaWVudCI+XzVkN2Q2Mjg5YjA0MGIwZDM5MmMxZDhlM2YzNTI3ZTk4YzBjM2I0ZDI3ZTwvc2FtbDpOYW1lSUQ+PHNhbWw6U3ViamVjdENvbmZpcm1hdGlvbiBNZXRob2Q9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpjbTpiZWFyZXIiPjxzYW1sOlN1YmplY3RDb25maXJtYXRpb25EYXRhIE5vdE9uT3JBZnRlcj0iMjMzNC0wOS0yN1QxNTowOTo0NFoiIFJlY2lwaWVudD0iaHR0cDovL2xvY2FsaG9zdDozMDAwL2F1dGgvbG9naW4vY2FsbGJhY2siIEluUmVzcG9uc2VUbz0iX2E3MjFlODI0YmY5MzI5ZWZiNTRmIi8+PC9zYW1sOlN1YmplY3RDb25maXJtYXRpb24+PC9zYW1sOlN1YmplY3Q+PHNhbWw6Q29uZGl0aW9ucyBOb3RCZWZvcmU9IjIwMTctMTEtMDZUMjE6MjI6MzRaIiBOb3RPbk9yQWZ0ZXI9IjIzMzQtMDktMjdUMTU6MDk6NDRaIj48c2FtbDpBdWRpZW5jZVJlc3RyaWN0aW9uPjxzYW1sOkF1ZGllbmNlPmh0dHA6Ly9hcHAuZXhhbXBsZS5jb208L3NhbWw6QXVkaWVuY2U+PC9zYW1sOkF1ZGllbmNlUmVzdHJpY3Rpb24+PC9zYW1sOkNvbmRpdGlvbnM+PHNhbWw6QXV0aG5TdGF0ZW1lbnQgQXV0aG5JbnN0YW50PSIyMDE3LTExLTA2VDE4OjQwOjQwWiIgU2Vzc2lvbk5vdE9uT3JBZnRlcj0iMjAxNy0xMS0wN1QwMjo0MDo0MFoiIFNlc3Npb25JbmRleD0iXzgzZTMyYzg3MGQ4MTYxNzg5OWUzY2I2YmVmNjg1MzRlZWRjYmE1MGQyYiI+PHNhbWw6QXV0aG5Db250ZXh0PjxzYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPnVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlBhc3N3b3JkPC9zYW1sOkF1dGhuQ29udGV4dENsYXNzUmVmPjwvc2FtbDpBdXRobkNvbnRleHQ+PC9zYW1sOkF1dGhuU3RhdGVtZW50PjxzYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48c2FtbDpBdHRyaWJ1dGUgTmFtZT0idWlkIiBOYW1lRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXR0cm5hbWUtZm9ybWF0OmJhc2ljIj48c2FtbDpBdHRyaWJ1dGVWYWx1ZSB4c2k6dHlwZT0ieHM6c3RyaW5nIj4xPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjwvc2FtbDpBdHRyaWJ1dGU+PHNhbWw6QXR0cmlidXRlIE5hbWU9ImVkdVBlcnNvbkFmZmlsaWF0aW9uIiBOYW1lRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXR0cm5hbWUtZm9ybWF0OmJhc2ljIj48c2FtbDpBdHRyaWJ1dGVWYWx1ZSB4c2k6dHlwZT0ieHM6c3RyaW5nIj5ncm91cDE8L3NhbWw6QXR0cmlidXRlVmFsdWU+PC9zYW1sOkF0dHJpYnV0ZT48c2FtbDpBdHRyaWJ1dGUgTmFtZT0iZW1haWwiIE5hbWVGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphdHRybmFtZS1mb3JtYXQ6YmFzaWMiPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhzaTp0eXBlPSJ4czpzdHJpbmciPnVzZXIxQGV4YW1wbGUuY29tPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjwvc2FtbDpBdHRyaWJ1dGU+PC9zYW1sOkF0dHJpYnV0ZVN0YXRlbWVudD48L3NhbWw6QXNzZXJ0aW9uPjwvc2FtbHA6UmVzcG9uc2U+'})
            .expect((res) => {
              expect(
                res.headers.location.indexOf(nconf.get('auth:saml:finalUrl'))
              ).to.eq(0)
              // should have reused 'user1'
              expect(res.headers).to.have.property('set-cookie')
              const cookie = res.headers['set-cookie'][0].split(';')[0] // :(
              const token = cookie.replace('_token_v1=', '')
              const token_data = decodeUserToken(token)
              expect(token_data.id).to.eq(user.id)
              expect(token_data.username).to.eq('user1')
              expect(token_data.type).to.eq('ADMIN')
            })
            .end(done)
        })
    })
  })
})