import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateQueryParams, RequestQueryBuilder } from '@nestjsx/crud-request';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CrudListResponse, uuid } from '../../core/types';
import { Post } from '../models';

@Injectable()
export class BlogService {
  constructor(
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer
  ) {}

  getAllPost(query: CreateQueryParams = {}) {
    const qb = RequestQueryBuilder.create(query).query();
    return this.http
      .get<CrudListResponse<Post>>(`${environment.apiUrl}/posts`, {
        params: new HttpParams({ fromString: qb }),
      })
      .pipe(
        map((payload) => {
          return {
            ...payload,
            data: payload.data.map((item) => new Post(item)),
          };
        })
      );
  }

  getPostById(id: uuid, query: CreateQueryParams = {}) {
    const qb = RequestQueryBuilder.create(query).query();
    return this.http
      .get<Post>(`${environment.apiUrl}/posts/${id}`, {
        params: new HttpParams({ fromString: qb }),
      })
      .pipe(map((payload) => new Post(payload)));
  }

  createPost(payload: FormData, query: CreateQueryParams = {}) {
    const qb = RequestQueryBuilder.create(query).query();
    return this.http
      .post<Post>(`${environment.apiUrl}/posts`, payload, {
        params: new HttpParams({ fromString: qb }),
      })
      .pipe(map((payload) => new Post(payload)));
  }

  updatePost(id: uuid, payload: FormData, query: CreateQueryParams = {}) {
    const qb = RequestQueryBuilder.create(query).query();
    return this.http.patch<Partial<Post>>(
      `${environment.apiUrl}/posts/${id}`,
      payload,
      { params: new HttpParams({ fromString: qb }) }
    );
  }

  deletePost(id: uuid) {
    return this.http.delete(`${environment.apiUrl}/posts/${id}`);
  }

  toggleVote(postId: uuid) {
    return this.http.patch<boolean>(
      `${environment.apiUrl}/posts/${postId}/react`,
      {}
    );
  }

  toggleBookmark(postId: uuid) {
    return this.http.post<{ id: uuid; isRemoved: boolean }>(
      `${environment.apiUrl}/posts/${postId}/bookmark`,
      {
        postId,
      }
    );
  }

  // Private functions
  /**
   * Converts ArrayBuffer to Base64 SafeURL
   * @param imgBuffer ArrayBuffer
   * @param contentType
   * @returns Base64 SafeUrl
   * @url https://medium.com/@koteswar.meesala/convert-array-buffer-to-base64-string-to-display-images-in-angular-7-4c443db242cd
   */
  private _convertToBase64Url(imgBuffer: ArrayBuffer, contentType: string) {
    const arr = new Uint8Array(imgBuffer);
    const strChar = arr.reduce((acc, byte) => {
      return acc + String.fromCharCode(byte);
    }, '');
    const base64 = btoa(strChar);
    const base64Url = this.sanitizer.bypassSecurityTrustUrl(
      `url(data:${contentType};base64,${base64})`
    );
    return (base64Url as any).changingThisBreaksApplicationSecurity;
  }
}
