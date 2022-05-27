---
title: DB 정규화란
date: 2022-02-24 16:05:37
category: Mysql
thumbnail: { thumbnailSrc }
draft: false
---

`데이터베이스 정규화`란 데이터베이스의 설계를 재구성하는 테크닉입니다.  
DB 정규화의 목적은 보통 3가지입니다.

> 1. 불필요한 데이터 제거
> 2. 데이터 저장을 '논리적으로'
> 3. 삽입/수정/삭제 시 발생할 수 있는 오류 방지

## 1차 정규화

> 1차 정규화란, 테이블의 컬럼이 원자 값(= 1개 값)을 갖도록 테이블 분해


<div align="center"><img src="https://user-images.githubusercontent.com/67765871/161941608-e217a904-d8bf-48eb-ac08-d4e2ba2db1ed.png" alt=""></div> 
<p align="center">[한 컬럼 내 여러 개의 값을 갖는 테이블]</p>


Kim의 수강 과목이 **한 레코드 안에서 2개를 가져 1차 정규형에 위반**됩니다. 아래와 같이 테이블을 분해하여 **1차 정규화** 합니다.

<div align="center"><img src="https://user-images.githubusercontent.com/67765871/161941619-b534eb1b-55fc-4e7d-8530-dff4d489f354.png" alt=""></div>
<p align="center">[1차 정규화를 마친 테이블]</p>


위와 같이 분해하여 컬럼이 원자값을 갖게 합니다. 하지만, **데이터 중복 현상**을 확인할 수 있습니다.

## 2차 정규화

> 완전 함수 종속을 만족하도록 테이블을 분해  
> 완전 함수 종속이란, 기본키의 부분집합이 결정자가 되어선 안된다는 것을 의미 -> 기본키 중에 특정 컬럼에만 종속된 컬럼 X

<div align="center"><img src="https://user-images.githubusercontent.com/67765871/161941621-e22e877e-3f51-4ac0-a677-ca117a2bc806.png" alt=""></div>
<p align="center">[1차 정규화를 마친 테이블]</p>


- 위 테이블의 기본키는 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">(이름, 수강 과목)</span>으로 복합키 
- 이 두 개가 합쳐져야 한 레코드를 구분 가능
- <span style="background: rgb(0 30 181 / 15%); font-weight: bold">나이</span>의 경우 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">이름</span>에만 종속
-> <span style="background: rgb(0 30 181 / 15%); font-weight: bold">이름</span>을 알면 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">나이</span>를 알 수 있음
- **따라서, <span style="background: rgb(0 30 181 / 15%); font-weight: bold">나이</span> 두 번 삽입은 비효율적**

<div align="center">
    <img src="https://user-images.githubusercontent.com/67765871/161941623-0ee58420-1819-4ef8-abd2-2a2471cc76c8.png" alt="">
    <img src="https://user-images.githubusercontent.com/67765871/161941625-ff2c732c-715d-4fc4-bc67-27af2dbc9d2f.png" alt="">
</div>
<p align="center">[2차 정규화를 통해 분리된 테이블]</p>

## 3차 정규화

> 이행적 종속을 없애도록 테이블을 분해  
> 이행적 종속이란, A -> B, B -> C가 성립할 때 A -> C가 성립 의미 -> 기본키 이외에 다른 컬럼이 그 외의 다른 컬럼을 결정할 수 없다

<div align="center"><img src="https://user-images.githubusercontent.com/67765871/161941633-b20fd9fb-74af-4592-993a-368b6a6fd0f1.png" alt=""></div>

- <span style="background: rgb(0 30 181 / 15%); font-weight: bold">지역 코드</span>를 통해 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">도시</span>를 결정
- 여러 사람들이 동일한 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">지역 코드</span>를 가지면 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">도시</span>가 결정되기 때문에, 이 컬럼들에 데이터 중복 가능
- 이를 해결하기 위해 테이블을 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">논리적인 단위(사람, 주소)</span>로 분리

<div align="center">
    <img src="https://user-images.githubusercontent.com/67765871/161941635-a5a172a6-5a96-461f-b3ba-4c779c2007df.png" alt="">
    <img src="https://user-images.githubusercontent.com/67765871/161941637-21888cca-bd58-4216-a365-e72a66595181.png" alt="">
</div>
<p align="center">[3차 정규화를 마친 사람 테이블과 지역 테이블]</p>

## BCNF(Boyce-Codd Normal Form)

> 모든 결정자가 후보키가 되어 테이블을 분해

<div align="center"><img src="https://user-images.githubusercontent.com/67765871/161941641-f2c9fda6-6dec-44dc-926a-96570c9bc3c7.png" alt=""></div>

- 기본키 = <span style="background: rgb(0 30 181 / 15%); font-weight: bold">(이름, 과목)</span>
- 기본키<span style="background: rgb(0 30 181 / 15%); font-weight: bold">(이름, 과목)</span>은 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">교수님</span>을 결정, <span style="background: rgb(0 30 181 / 15%); font-weight: bold">교수님</span>은 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">과목</span>을 결정
- 하지만 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">교수님</span>은 결정자지만 후보키는 아닌 문제 -> 만약 <span style="background: rgb(0 30 181 / 15%); font-weight: bold">과목</span>이 변경되면, <span style="background: rgb(0 30 181 / 15%); font-weight: bold">교수님</span>도 변경해야하는 문제가 발생 가능 

아래와 같이 테이블을 2개로 분해하면 BCNF화를 할 수 있습니다.

<div align="center">
    <img src="https://user-images.githubusercontent.com/67765871/161941644-d5b82722-ebff-4cde-993a-adda9742c6bb.png" alt="">
    <img src="https://user-images.githubusercontent.com/67765871/161941647-7369bd51-9081-4c8e-a77a-5f14ac59c3d1.png" alt="">
</div>
<p align="center">[분해한 수강 테이블과 교수 테이블]</p>

## 참고 자료

[정규화(Normalization) - 1차 2차 3차 BCNF](https://jiyoungtt.tistory.com/47)